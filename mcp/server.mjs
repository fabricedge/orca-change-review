import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { resolve } from 'node:path'
import { revisions } from '../lib/revisions.mjs'
import manifest from './package.json' with { type: 'json' }
import initialAdditional from '../data/reviews.json' with { type: 'json' }
import { readReviews, saveReview } from './review-store.mjs'
import { readIssueGuidelines } from './issue-guidelines.mjs'
import { startRecording, getRecording } from './test-recording.mjs'
import { asttspGroups } from '../lib/asttsp.mjs'

const site = resolve(import.meta.dirname, '..')
const builtIn = revisions.filter(
  (review) => !initialAdditional.some((entry) => entry.slug === review.slug)
)
const text = z.string().trim().min(1).max(20000)
const reviewSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: text,
  topic: text.optional(),
  asttsp: z.array(text).max(20).optional(),
  summary: text,
  kind: z.enum(['Issue', 'PR', 'Commit', 'Comparação']),
  status: text,
  implementation: text,
  repository: z
    .string()
    .regex(/^[\w.-]+\/[\w.-]+$/)
    .optional(),
  issue: z.string().url().optional(),
  pullRequest: z.string().url().optional(),
  issueDraft: z
    .object({
      type: z.enum(['bug', 'feature']),
      problem: text,
      impact: text,
      expected: text,
      observed: text,
      reproduction: z.array(text).max(100),
      guidelinesSource: text,
      proposal: text.optional()
    })
    .optional(),
  branches: z.array(text).max(100),
  commits: z.array(z.object({ id: z.string().regex(/^[a-f0-9]{7,40}$/), label: text })).max(100),
  sections: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]+$/),
        title: text,
        paragraphs: z.array(text).optional(),
        items: z.array(text).optional(),
        code: text.optional(),
        codeCaption: text.optional()
      })
    )
    .max(100)
})

export function createReviewServer({
  directory = site,
  baseReviews = builtIn,
  target = process.env.ORCA_REVIEW_TARGET
} = {}) {
  const server = new McpServer({ name: 'orca-review', version: manifest.version })
  const result = (value) => ({ content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] })
  const call = (handler) => async (args) => {
    try {
      return result(await handler(args))
    } catch (error) {
      return { content: [{ type: 'text', text: error.message }], isError: true }
    }
  }
  server.registerTool(
    'list_asttsp_groups',
    {
      description: 'List registered Alternative Solutions To The Same Problem groups. Tag a PR with review.asttsp containing these IDs when calling save_review.',
      inputSchema: {},
      annotations: { readOnlyHint: true }
    },
    call(() => asttspGroups)
  )
  server.registerTool(
    'list_reviews',
    {
      description:
        'List local Orca Review records. These are recorded snapshots, not live provider status.',
      inputSchema: { query: z.string().max(500).optional() },
      annotations: { readOnlyHint: true }
    },
    call(async ({ query = '' }) =>
      (await readReviews(directory, baseReviews)).filter((review) =>
        JSON.stringify(review).toLowerCase().includes(query.toLowerCase())
      )
    )
  )
  server.registerTool(
    'get_review',
    {
      description: 'Read the description, problem, evidence and source references for one review.',
      inputSchema: { slug: text },
      annotations: { readOnlyHint: true }
    },
    call(async ({ slug }) => {
      const review = (await readReviews(directory, baseReviews)).find(
        (entry) => entry.slug === slug
      )
      if (!review) {
        throw new Error('Review not found')
      }
      return review
    })
  )
  server.registerTool(
    'issue_guidance',
    {
      description:
        'Read CONTRIBUTING and issue templates from the explicitly configured target checkout. Identify the real user problem before proposing a fix.',
      inputSchema: {},
      annotations: { readOnlyHint: true }
    },
    call(() => readIssueGuidelines(target))
  )
  server.registerTool(
    'save_review',
    {
      description:
        'Save a local review linked to an issue, PR, commit, or problem-first issue draft. Updates require the last updatedAt as expectedUpdatedAt. Never publishes, commits or pushes. Rebuild the site to include changes in Pages.',
      inputSchema: {
        review: reviewSchema,
        expectedUpdatedAt: z.string().optional(),
        recordingId: z.string().optional(),
        videoUrls: z
          .array(
            z
              .string()
              .url()
              .refine((url) => url.startsWith('https://'))
          )
          .max(100)
          .optional()
      },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false }
    },
    call(async ({ review, expectedUpdatedAt, recordingId, videoUrls = [] }) => {
      if (recordingId) {
        const capture = await getRecording(directory, recordingId)
        if (capture.execution !== 'exited') {
          throw new Error('Wait for the recording to finish before saving its evidence.')
        }
        if (videoUrls.length > capture.videos.length) {
          throw new Error('More video URLs than captured videos.')
        }
        review = {
          ...review,
          testEvidence: {
            recordingId,
            testFile: capture.testFile,
            outcome: capture.outcome,
            recordedAt: capture.finishedAt,
            sourceCommit: capture.sourceCommit,
            trackedChanges: capture.trackedChanges,
            stats: capture.stats,
            limitations: capture.limitations,
            videoUrls
          }
        }
      } else if (videoUrls.length) {
        throw new Error('Video URLs require a recordingId.')
      }
      return saveReview(directory, baseReviews, review, expectedUpdatedAt)
    })
  )
  server.registerTool(
    'record_orca_test',
    {
      description:
        'Run and video-record one Orca Electron E2E spec on the configured host using the existing headless fixture. Rebuilds the app, executes repository test code and writes local artifacts. Returns immediately with a recording id. checkOnly validates the plan without running anything.',
      inputSchema: { testFile: z.string().max(500), checkOnly: z.boolean().optional() },
      annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: true }
    },
    call(({ testFile, checkOnly }) => startRecording(directory, target, testFile, { checkOnly }))
  )
  server.registerTool(
    'get_recording',
    {
      description:
        'Read recording execution state, actual test outcome, report counts and video paths. After a server restart, an unfinished run is unverifiable, never assumed exited. A video alone is not a passing test.',
      inputSchema: { id: z.string() },
      annotations: { readOnlyHint: true }
    },
    call(({ id }) => getRecording(directory, id))
  )
  return server
}

if (process.argv[1] && resolve(process.argv[1]) === import.meta.filename) {
  const server = createReviewServer()
  await server.connect(new StdioServerTransport())
}

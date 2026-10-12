import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, rm, symlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { createReviewServer } from './server.mjs'
import { saveReview, readReviews } from './review-store.mjs'
import { readIssueGuidelines } from './issue-guidelines.mjs'
import { validateRevisions } from '../lib/validate-revisions.mjs'

const draft = {
  slug: 'tab-position-problem',
  topic: 'tabs-layout',
  title: 'Cannot identify tab position',
  summary: 'An agent cannot locate the selected tab',
  kind: 'Issue',
  status: 'Local draft',
  implementation: 'Not implemented',
  branches: [],
  commits: [],
  sections: [],
  issueDraft: {
    type: 'bug',
    problem: 'The selected tab cannot be distinguished',
    impact: 'Blocks arranging the workspace',
    expected: 'Identify the selected tab',
    observed: 'Only its repeated title is available',
    reproduction: ['Open two tabs with the same title', 'Ask an agent to locate the second tab'],
    guidelinesSource: '.github/ISSUE_TEMPLATE/bug_report.yml'
  }
}
async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'orca-review-mcp-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  await mkdir(join(root, 'data'))
  await writeFile(join(root, 'data/reviews.json'), '[]')
  return root
}

test('issue-only references work on GitHub and GitLab; drafts require an actual problem', () => {
  for (const issue of [
    'https://github.com/owner/repo/issues/1',
    'https://gitlab.com/group/repo/-/issues/2'
  ]) {
    const { issueDraft: _issueDraft, ...base } = draft
    assert.doesNotThrow(() => validateRevisions([{ ...base, issue }]))
    assert.throws(
      () => validateRevisions([{ ...base, issue: 'https://example.com/not-an-issue' }]),
      /issue inválida/
    )
  }
  assert.throws(
    () => validateRevisions([{ ...draft, issueDraft: { ...draft.issueDraft, problem: '' } }]),
    /problem/
  )
  assert.throws(
    () => validateRevisions([{ ...draft, issueDraft: { ...draft.issueDraft, reproduction: [] } }]),
    /reprodução/
  )
  assert.throws(
    () =>
      validateRevisions([{ ...draft, issueDraft: { ...draft.issueDraft, guidelinesSource: '' } }]),
    /guidelinesSource/
  )
})

test('saved drafts preserve creation time, reject stale edits, and reject built-in collisions', async (t) => {
  const root = await fixture(t)
  const saved = await saveReview(root, [], draft)
  assert.ok(saved.createdAt)
  const updated = await saveReview(
    root,
    [],
    { ...draft, title: 'Clarified problem' },
    saved.updatedAt
  )
  assert.equal(updated.createdAt, saved.createdAt)
  await assert.rejects(saveReview(root, [], draft, '2000-01-01T00:00:00Z'), /changed/)
  await assert.rejects(saveReview(root, [draft], draft), /Built-in/)
  assert.equal((await readReviews(root, []))[0].title, 'Clarified problem')
  assert.deepEqual(
    (await readReviews(root, []))[0],
    JSON.parse(await readFile(join(root, 'data/reviews.json'), 'utf8'))[0]
  )
})

test('concurrent writers cannot silently replace each other', async (t) => {
  const root = await fixture(t)
  const results = await Promise.allSettled([
    saveReview(root, [], draft),
    saveReview(root, [], draft)
  ])
  assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1)
  assert.equal((await readReviews(root, [])).length, 1)
})

test('guidelines require an explicit checkout and reject external symlinks', async (t) => {
  const root = await fixture(t)
  await assert.rejects(readIssueGuidelines(), /ORCA_REVIEW_TARGET/)
  await writeFile(join(root, 'CONTRIBUTING.md'), 'Describe the problem before the solution.')
  assert.equal(
    (await readIssueGuidelines(root)).files[0].content,
    'Describe the problem before the solution.'
  )
  const outside = await mkdtemp(join(tmpdir(), 'orca-review-outside-'))
  t.after(() => rm(outside, { recursive: true, force: true }))
  await writeFile(join(outside, 'private.md'), 'Not a repository guideline')
  await mkdir(join(root, '.github'))
  try {
    await symlink(join(outside, 'private.md'), join(root, '.github/CONTRIBUTING.md'))
  } catch (error) {
    if (error.code === 'EPERM') {
      return
    }
    throw error
  }
  await assert.rejects(readIssueGuidelines(root), /escapes/)
})

test('MCP client discovers tools, saves a draft, lists and reads it, and receives tool errors', async (t) => {
  const root = await fixture(t)
  const server = createReviewServer({ directory: root, baseReviews: [], target: root })
  const client = new Client({ name: 'review-test', version: '1.0.0' })
  const [serverTransport, clientTransport] = InMemoryTransport.createLinkedPair()
  await server.connect(serverTransport)
  await client.connect(clientTransport)
  t.after(async () => {
    await client.close()
    await server.close()
  })
  assert.equal((await client.listTools()).tools.length, 7)
  const saved = await client.callTool({ name: 'save_review', arguments: { review: draft } })
  assert.ok(!saved.isError)
  const groups = await client.callTool({ name: 'list_asttsp_groups', arguments: {} })
  assert.equal(JSON.parse(groups.content[0].text)[0].id, 'tab-context')
  const tagged = await client.callTool({ name: 'save_review', arguments: {
    review: { ...draft, slug: 'alternative-pr', kind: 'PR', pullRequest: 'https://gitlab.com/team/project/-/merge_requests/9', asttsp: ['tab-context'] }
  } })
  assert.ok(!tagged.isError)
  const taggedRead = await client.callTool({ name: 'get_review', arguments: { slug: 'alternative-pr' } })
  assert.deepEqual(JSON.parse(taggedRead.content[0].text).asttsp, ['tab-context'])
  const invalidTag = await client.callTool({ name: 'save_review', arguments: {
    review: { ...draft, slug: 'invalid-tag', pullRequest: 'https://github.com/team/project/pull/9', asttsp: ['unknown'] }
  } })
  assert.equal(invalidTag.isError, true)
  const listed = await client.callTool({
    name: 'list_reviews',
    arguments: { query: 'tab-position' }
  })
  assert.equal(JSON.parse(listed.content[0].text)[0].slug, draft.slug)
  const read = await client.callTool({ name: 'get_review', arguments: { slug: draft.slug } })
  assert.equal(JSON.parse(read.content[0].text).issueDraft.problem, draft.issueDraft.problem)
  assert.equal(JSON.parse(read.content[0].text).topic, draft.topic)
  const absent = await client.callTool({ name: 'get_review', arguments: { slug: 'missing' } })
  assert.equal(absent.isError, true)
  const id = '12345678-1234-1234-1234-123456789abc'
  await mkdir(join(root, 'recordings', id), { recursive: true })
  await writeFile(
    join(root, 'recordings', id, 'capture.json'),
    JSON.stringify({
      id,
      execution: 'exited',
      outcome: 'failed',
      testFile: 'tests/e2e/feature.spec.ts',
      finishedAt: '2026-10-11T23:14:40Z',
      sourceCommit: null,
      trackedChanges: null,
      stats: { expected: 0, unexpected: 1 },
      videos: ['results/app.webm'],
      limitations: 'Selected fixture only'
    })
  )
  const current = JSON.parse(read.content[0].text)
  const attached = await client.callTool({
    name: 'save_review',
    arguments: {
      review: draft,
      expectedUpdatedAt: current.updatedAt,
      recordingId: id,
      videoUrls: ['https://example.com/failed-test.webm']
    }
  })
  assert.ok(!attached.isError)
  assert.equal(JSON.parse(attached.content[0].text).testEvidence.outcome, 'failed')
  const updated = JSON.parse(attached.content[0].text)
  const textEdit = await client.callTool({
    name: 'save_review',
    arguments: {
      review: { ...draft, summary: 'Clarified failure' },
      expectedUpdatedAt: updated.updatedAt
    }
  })
  assert.equal(JSON.parse(textEdit.content[0].text).testEvidence.outcome, 'failed')
})

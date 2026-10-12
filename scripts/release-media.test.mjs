import { test } from 'node:test'
import assert from 'node:assert/strict'
import { releaseManifest, mediaVariants } from '../lib/release-media.mjs'
import { validateRevisions } from '../lib/validate-revisions.mjs'

test('all three recordings map to immutable release download URLs', () => {
  const manifest = releaseManifest(
    'owner/site',
    'recordings/v1',
    mediaVariants.map((id) => `${id}.webm`),
    '2026-10-11'
  )
  assert.equal(manifest.captureKind, 'orca-app')
  assert.equal(
    manifest.variants['split-control'].video,
    'https://github.com/owner/site/releases/download/recordings%2Fv1/split-control.webm'
  )
  assert.equal(Object.keys(manifest.variants).length, 3)
})
test('missing video or invalid repository cannot produce a release manifest', () => {
  assert.throws(() => releaseManifest('owner/site', 'v1', ['cli-only.webm']), /Missing/)
  assert.throws(() => releaseManifest('invalid', 'v1', []), /OWNER/)
})
test('a change requires a PR or commit, while a PR-only record is accepted', () => {
  const change = {
    slug: 'test-change',
    title: 'Change',
    summary: 'Summary',
    kind: 'PR',
    status: 'Open',
    implementation: 'Implemented',
    branches: [],
    commits: [],
    sections: []
  }
  assert.throws(() => validateRevisions([change]), /PR/)
  assert.doesNotThrow(() =>
    validateRevisions([{ ...change, pullRequest: 'https://github.com/owner/repo/pull/42' }])
  )
  assert.doesNotThrow(() => validateRevisions([{ ...change, commits: [{ id: 'abc1234' }] }]))
})

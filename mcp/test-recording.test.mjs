import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { recordingOutcome, recordingPlan, startRecording, getRecording } from './test-recording.mjs'

test('a video does not turn a failed, skipped or missing test report into a pass', () => {
  const stats = { expected: 1, unexpected: 0, flaky: 0, skipped: 0 }
  assert.equal(recordingOutcome({ stats }, 0, ['app.webm']), 'passed')
  assert.equal(recordingOutcome({ stats }, 1, ['app.webm']), 'failed')
  assert.equal(recordingOutcome(null, 0, ['app.webm']), 'incomplete')
  assert.equal(recordingOutcome({ stats }, 0, []), 'incomplete')
  assert.equal(recordingOutcome({ stats: { ...stats, skipped: 1 } }, 0, ['app.webm']), 'incomplete')
  assert.equal(
    recordingOutcome({ stats: { ...stats, expected: 0 } }, 0, ['app.webm']),
    'incomplete'
  )
})

test('dry-run validates one existing spec and never starts an app or creates artifacts', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'orca-record-plan-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  await mkdir(join(root, 'tests/e2e'), { recursive: true })
  await writeFile(join(root, 'tests/playwright.config.ts'), 'export default {}')
  await writeFile(join(root, 'tests/e2e/feature.spec.ts'), 'test fixture')
  const plan = await startRecording(root, root, 'tests/e2e/feature.spec.ts', { checkOnly: true })
  assert.equal(plan.project, 'electron-headless')
  await assert.rejects(recordingPlan(root, '../../private.spec.ts'), /Select/)
  await assert.rejects(recordingPlan(root, 'tests/e2e/missing.spec.ts'), /ENOENT/)
  await assert.rejects(recordingPlan(undefined, 'tests/e2e/feature.spec.ts'), /ORCA_REVIEW_TARGET/)
})

test('a run left live by a previous server is unverifiable, not exited', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'orca-record-state-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const id = '12345678-1234-1234-1234-123456789abc'
  await mkdir(join(root, 'recordings', id), { recursive: true })
  await writeFile(
    join(root, 'recordings', id, 'capture.json'),
    JSON.stringify({ id, execution: 'live', outcome: 'not-run' })
  )
  assert.equal((await getRecording(root, id)).execution, 'unverifiable')
  await assert.rejects(getRecording(root, '../private'), /Invalid/)
})

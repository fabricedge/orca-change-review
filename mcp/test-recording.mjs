import { mkdir, readFile, readdir, realpath, writeFile, open } from 'node:fs/promises'
import { join, relative, isAbsolute } from 'node:path'
import { pathToFileURL } from 'node:url'
import { randomUUID } from 'node:crypto'

const active = new Map()

export async function recordingPlan(target, testFile) {
  if (!target) {
    throw new Error('Set ORCA_REVIEW_TARGET to the Orca checkout to record.')
  }
  if (!/^tests\/e2e\/[a-zA-Z0-9_./-]+\.spec\.ts$/.test(testFile)) {
    throw new Error('Select one tests/e2e/*.spec.ts file.')
  }
  const checkout = await realpath(target)
  const file = await realpath(join(checkout, testFile))
  const path = relative(join(checkout, 'tests/e2e'), file)
  if (path.startsWith('..') || isAbsolute(path)) {
    throw new Error('Test must remain inside tests/e2e.')
  }
  await readFile(join(checkout, 'tests/playwright.config.ts'), 'utf8')
  return {
    checkout,
    testFile,
    project: 'electron-headless',
    instructions:
      'Uses the existing Orca E2E configuration and Electron fixture. Headful tests are excluded. Global setup rebuilds the app. A test must use the recording-capable Orca app fixture to produce a video.'
  }
}

export function recordingOutcome(report, exitCode, videos) {
  if (
    exitCode === 0 &&
    report?.stats?.expected > 0 &&
    report.stats.unexpected === 0 &&
    report.stats.flaky === 0 &&
    report.stats.skipped === 0 &&
    videos.length > 0
  ) {
    return 'passed'
  }
  if (exitCode !== 0 || report?.stats?.unexpected > 0) {
    return 'failed'
  }
  return 'incomplete'
}

async function videosIn(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true }).catch((error) => {
    if (error.code === 'ENOENT') {
      return []
    }
    throw error
  })) {
    const file = join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await videosIn(file)))
    } else if (entry.isFile() && entry.name.endsWith('.webm')) {
      files.push(file)
    }
  }
  return files
}

export async function getRecording(site, id) {
  if (!/^[a-f0-9-]{36}$/.test(id)) {
    throw new Error('Invalid recording ID')
  }
  const record = JSON.parse(await readFile(join(site, 'recordings', id, 'capture.json'), 'utf8'))
  if (record.execution === 'live' && !active.has(id)) {
    record.execution = 'unverifiable'
  }
  return record
}

export async function startRecording(site, target, testFile, { checkOnly = false } = {}) {
  const plan = await recordingPlan(target, testFile)
  if (checkOnly) {
    return plan
  }
  if (active.size > 0) {
    throw new Error('A recording is already running in this MCP process.')
  }
  if (process.platform === 'linux' && !process.env.DISPLAY) {
    throw new Error(
      'Electron needs an isolated display. Start this MCP server under xvfb-run -a, or use an existing graphical session with hidden windows.'
    )
  }
  const id = randomUUID()
  active.set(id, null)
  try {
    const { spawnProcess, runProcessSync } = await import(
      pathToFileURL(join(plan.checkout, 'config/scripts/script-child-process.mjs')).href
    )
    const directory = join(site, 'recordings', id)
    const results = join(directory, 'results')
    await mkdir(directory, { recursive: true })
    const reportFile = join(directory, 'report.json')
    const log = await open(join(directory, 'run.log'), 'a')
    const commit = runProcessSync({
      program: 'git',
      args: ['rev-parse', 'HEAD'],
      cwd: plan.checkout
    })
    const dirty = runProcessSync({
      program: 'git',
      args: ['status', '--porcelain', '--untracked-files=no'],
      cwd: plan.checkout
    })
    const record = {
      id,
      kind: 'orca-app-test',
      execution: 'live',
      outcome: 'not-run',
      testFile,
      startedAt: new Date().toISOString(),
      sourceCommit: commit.code === 0 ? commit.stdout.trim() : null,
      trackedChanges: dirty.code === 0 ? Boolean(dirty.stdout.trim()) : null,
      videos: [],
      limitations:
        'Evidence for this selected test and checkout only. Untracked files are not included in the dirty flag. Does not replace code review, full CI, other platforms or SSH validation.'
    }
    const persist = () =>
      writeFile(join(directory, 'capture.json'), `${JSON.stringify(record, null, 2)}\n`)
    await persist()
    const env = {
      ...process.env,
      ORCA_BACKGROUND_LAUNCH: '1',
      ORCA_E2E_HEADLESS: '1',
      ORCA_E2E_RECORD_VIDEO: '1',
      ORCA_E2E_TEST_REPO_PATH_FILE: join(directory, 'test-repo.txt'),
      PLAYWRIGHT_JSON_OUTPUT_FILE: reportFile
    }
    for (const key of [
      'SKIP_BUILD',
      'ORCA_E2E_HEADFUL',
      'ORCA_E2E_FORCE_HEADFUL',
      'ELECTRON_RUN_AS_NODE'
    ]) {
      delete env[key]
    }
    const args = [
      'exec',
      'playwright',
      'test',
      testFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      '--config',
      'tests/playwright.config.ts',
      '--project',
      'electron-headless',
      '--workers',
      '1',
      '--retries',
      '0',
      '--reporter',
      'json',
      '--output',
      results
    ]
    let child
    try {
      child = spawnProcess({
        program: 'pnpm',
        args,
        cwd: plan.checkout,
        env,
        stdio: ['ignore', log.fd, log.fd]
      })
    } catch (error) {
      await log.close()
      record.execution = 'exited'
      record.outcome = 'failed'
      record.error = error.message
      await persist()
      throw error
    }
    active.set(id, child)
    let finalized = false
    const finish = async (code, error) => {
      if (finalized) {
        return
      }
      finalized = true
      try {
        record.videos = (await videosIn(results)).map((file) => relative(directory, file))
        const report = await readFile(reportFile, 'utf8')
          .then(JSON.parse)
          .catch(() => null)
        record.stats = report?.stats ?? null
        record.execution = 'exited'
        record.exitCode = code
        record.outcome = recordingOutcome(report, code, record.videos)
        record.finishedAt = new Date().toISOString()
        if (error) {
          record.error = error.message
        }
        await persist()
      } catch (failure) {
        console.error('Could not finalize recording:', failure.message)
      } finally {
        active.delete(id)
        await log.close()
      }
    }
    child.once('error', (error) => void finish(null, error))
    child.once(
      'exit',
      (code, signal) => void finish(code, signal ? new Error(`Terminated: ${signal}`) : undefined)
    )
    return {
      ...record,
      directory,
      reportFile,
      next: 'Poll get_recording with this id. Review the report and video before publishing evidence.'
    }
  } catch (error) {
    active.delete(id)
    throw error
  }
}

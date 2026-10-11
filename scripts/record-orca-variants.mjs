import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { existsSync } from 'node:fs'

try {
  process.loadEnvFile(resolve('.env.local'))
} catch (error) {
  if (error.code !== 'ENOENT') {
    throw error
  }
}
const source = resolve(process.env.ORCA_SOURCE ?? '../orca')
process.env.ORCA_SOURCE = source
const project = resolve(import.meta.dirname, '..')
const movedRecorder = join(project, 'orca-artifacts/tab-copy-prs/recording/run-three.mjs')
await import(
  pathToFileURL(
    existsSync(movedRecorder)
      ? movedRecorder
      : join(source, 'artifacts/tab-copy-prs/recording/run-three.mjs')
  ).href
)

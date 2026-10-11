import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'

try {
  process.loadEnvFile(resolve('.env.local'))
} catch (error) {
  if (error.code !== 'ENOENT') {
    throw error
  }
}
const source = resolve(process.env.ORCA_SOURCE ?? '../orca')
await import(pathToFileURL(join(source, 'artifacts/tab-copy-prs/recording/run-three.mjs')).href)

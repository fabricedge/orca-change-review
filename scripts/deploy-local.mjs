import { createServer } from 'node:net'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'

const args = process.argv.slice(2)
const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback
const port = Number(option('--port', process.env.PORT || '3100'))
const hostname = option('--host', '127.0.0.1')
const directory = resolve(import.meta.dirname, '..')
if (!Number.isInteger(port) || port < 1 || port > 65535 || !hostname || hostname.startsWith('--')) {
  throw new Error('Use --port 1..65535 and --host 127.0.0.1 or your Tailscale IP.')
}
if (args.includes('--help')) {
  console.log('npm run deploy:local -- [--port 3100] [--host 127.0.0.1] [--check]\nStarts the local development preview. Use your Tailscale IP as --host for private remote access. Ctrl+C stops it.')
  process.exit(0)
}
await new Promise((accept, reject) => {
  const probe = createServer()
  probe.once('error', (error) => reject(new Error(error.code === 'EADDRINUSE'
    ? `Port ${port} is in use. Choose --port ${port + 1}; no existing process was stopped.` : error.message)))
  probe.listen(port, hostname, () => probe.close(accept))
})
if (!existsSync(resolve(directory, 'node_modules/next'))) {
  throw new Error('Install dependencies first: npm ci (with a lockfile), otherwise npm install.')
}
console.log(`Orca Review Changes\nLocal preview: http://${hostname.includes(':') ? `[${hostname}]` : hostname}:${port}\nSave this URL in Check locally. Stop with Ctrl+C.`)
if (!args.includes('--check')) {
  process.env.ORCA_BACKGROUND_LAUNCH = '1'
  delete process.env.ORCA_GITHUB_PAGES
  delete process.env.NEXT_PUBLIC_BASE_PATH
  const { startServer } = await import('next/dist/server/lib/start-server.js')
  await startServer({ dir: directory, port, hostname, isDev: true, allowRetry: false })
}

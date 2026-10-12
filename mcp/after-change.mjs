import { readFile } from 'node:fs/promises'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { createReviewServer } from './server.mjs'

const args = process.argv.slice(2)
const option = (name) => args.includes(name) ? args[args.indexOf(name) + 1] : undefined
const testFile = option('--test')
if (args.includes('--help') || !testFile) {
  console.log('npm --prefix mcp run after-change -- --test tests/e2e/example.spec.ts [--record] [--review review.json]\nDefault: validate only. --record runs the real test. --review saves its completed evidence locally. No upload, commit or push.')
  process.exit(testFile || args.includes('--help') ? 0 : 1)
}
const draft = option('--review') ? JSON.parse(await readFile(option('--review'), 'utf8')) : null
const server = createReviewServer()
const client = new Client({ name: 'orca-review-after-change', version: '1.0.0' })
const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
await server.connect(serverTransport)
await client.connect(clientTransport)
async function call(name, values) {
  const response = await client.callTool({ name, arguments: values })
  const text = response.content.filter((item) => item.type === 'text').map((item) => item.text).join('\n')
  if (response.isError) throw new Error(text)
  return JSON.parse(text)
}
try {
  let capture = await call('record_orca_test', { testFile, checkOnly: !args.includes('--record') })
  console.log(JSON.stringify(capture, null, 2))
  if (args.includes('--record')) {
    while (capture.execution === 'live') {
      await new Promise((accept) => setTimeout(accept, 2000))
      capture = await call('get_recording', { id: capture.id })
    }
    console.log(JSON.stringify(capture, null, 2))
    if (capture.execution !== 'exited') throw new Error('Recording is unverifiable. Inspect it on the execution host before retrying.')
    if (draft) {
      const saved = await call('save_review', { ...draft, recordingId: capture.id })
      console.log(`Saved local evidence: ${saved.slug}`)
    }
    if (capture.outcome !== 'passed') process.exitCode = 1
  }
} finally {
  await client.close()
  await server.close()
}

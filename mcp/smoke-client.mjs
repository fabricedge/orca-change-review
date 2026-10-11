import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { join } from 'node:path'

const client = new Client({ name: 'orca-review-smoke', version: '0.1.0' })
try {
  await client.connect(
    new StdioClientTransport({
      command: process.execPath,
      args: [join(import.meta.dirname, 'server.mjs')],
      env: { ORCA_BACKGROUND_LAUNCH: '1' }
    })
  )
  const { tools } = await client.listTools()
  console.log(`MCP stdio connected. Tools: ${tools.map((tool) => tool.name).join(', ')}`)
} finally {
  await client.close()
}

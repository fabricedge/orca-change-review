import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const release = process.argv[2]
if (!/^\d+\.\d+\.\d+$/.test(release || '')) throw new Error('Usage: npm run version:set -- 0.2.0')
const files = ['package.json', 'mcp/package.json', 'package-lock.json', 'mcp/package-lock.json']
const updates = []
for (const file of files) {
  let content
  try { content = JSON.parse(await readFile(resolve(root, file), 'utf8')) } catch (error) {
    if (error.code === 'ENOENT' && file.endsWith('package-lock.json')) continue
    throw error
  }
  content.version = release
  if (content.packages?.['']) content.packages[''].version = release
  updates.push([file, content])
}
for (const [file, content] of updates) await writeFile(resolve(root, file), `${JSON.stringify(content, null, 2)}\n`)
console.log(`Site and MCP: ${release}. Review CHANGELOG.md, run checks, then commit and tag v${release}. No commit or tag was created.`)

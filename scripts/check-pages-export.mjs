import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { revisions } from '../lib/revisions.mjs'
import { locales } from '../lib/i18n.mjs'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
const root = join(process.cwd(), 'out')
for (const route of [
  'index.html',
  'revisoes/index.html',
  ...locales.map((locale) => `${locale}/tab-copy/index.html`),
  ...revisions.map((revision) => `revisoes/${revision.slug}/index.html`)
]) {
  const html = await readFile(join(root, route), 'utf8')
  assert.ok(html.includes('<html'), `Missing HTML: ${route}`)
  assert.ok(!html.includes('href="/revisoes'), `Unprefixed catalog link: ${route}`)
  assert.ok(html.includes(`${basePath}/_next/`), `Incorrect asset prefix: ${route}`)
}
const manifest = JSON.parse(await readFile('media/releases.json', 'utf8'))
for (const variant of Object.values(manifest.variants)) {
  assert.ok(variant.video.startsWith('https://github.com/'), 'Video must use the public Release')
}
await stat(join(root, '404.html'))
console.log('Static routes, repository asset paths and Release video URLs verified.')

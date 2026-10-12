import assert from 'node:assert/strict'
import test from 'node:test'
import { defaultPreview, previewUrl, restorePreview } from './local-preview.mjs'

test('accepts localhost, Tailscale IPs and HTTPS hostnames with paths and ports', () => {
  assert.equal(previewUrl('localhost:3100'), 'http://localhost:3100/')
  assert.equal(previewUrl(' 100.91.176.16:3200/revisoes '), 'http://100.91.176.16:3200/revisoes')
  assert.equal(previewUrl('https://orca.example.ts.net/review/'), 'https://orca.example.ts.net/review/')
})

test('rejects executable protocols, credentials, empty addresses and invalid ports', () => {
  for (const value of ['javascript://alert(1)', 'file:///tmp/demo', 'https://user:secret@example.com', '', 'localhost:99999']) {
    assert.throws(() => previewUrl(value))
  }
})

test('restores the selected connection and handles stale or corrupted preferences', () => {
  const saved = { mode: 'tailscale', localhost: 'localhost:3100', tailscale: '100.91.176.16:3200' }
  assert.deepEqual(restorePreview(JSON.parse(JSON.stringify(saved))), {
    mode: 'tailscale', localhost: 'http://localhost:3100/', tailscale: 'http://100.91.176.16:3200/'
  })
  assert.deepEqual(restorePreview({ ...saved, tailscale: 'file:///etc/passwd' }), defaultPreview)
  assert.deepEqual(restorePreview(null), defaultPreview)
})

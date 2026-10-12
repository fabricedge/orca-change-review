export const previewStorageKey = 'orca-review:local-preview:v1'
export const defaultPreview = { mode: 'localhost', localhost: 'http://localhost:3100/', tailscale: '' }

export function previewUrl(value) {
  const input = value.trim()
  if (!input) throw new Error('empty')
  const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(input) ? input : `http://${input}`)
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('invalid')
  }
  return url.href
}

export function restorePreview(value) {
  if (!value || !['localhost', 'tailscale'].includes(value.mode)) return defaultPreview
  try {
    return {
      mode: value.mode,
      localhost: previewUrl(value.localhost),
      tailscale: value.tailscale ? previewUrl(value.tailscale) : ''
    }
  } catch {
    return defaultPreview
  }
}

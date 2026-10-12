'use client'

import React, { useEffect, useId, useState } from 'react'
import { defaultPreview, previewStorageKey, previewUrl, restorePreview } from '../lib/local-preview.mjs'

export function LocalPreview({ locale = 'en' }) {
  const pt = locale === 'pt-BR'
  const id = useId()
  const [settings, setSettings] = useState(defaultPreview)
  const [message, setMessage] = useState('')
  useEffect(() => {
    try {
      setSettings(restorePreview(JSON.parse(localStorage.getItem(previewStorageKey) || 'null')))
    } catch {
      setMessage(pt ? 'Armazenamento indisponível. Você ainda pode abrir os links.' : 'Storage is unavailable. You can still open the links.')
    }
  }, [pt])

  const selectedUrl = settings[settings.mode]
  let href = null
  try { href = previewUrl(selectedUrl) } catch { /* An incomplete address has no navigation link. */ }

  function save(event) {
    event.preventDefault()
    try {
      const next = {
        ...settings,
        localhost: previewUrl(settings.localhost),
        tailscale: settings.tailscale.trim() ? previewUrl(settings.tailscale) : ''
      }
      if (!next[next.mode]) throw new Error('empty')
      setSettings(next)
      try {
        localStorage.setItem(previewStorageKey, JSON.stringify(next))
        setMessage(pt ? 'Endereços e preferência salvos neste navegador.' : 'Addresses and preference saved in this browser.')
      } catch {
        setMessage(pt ? 'Endereço pronto. O navegador não permitiu salvar a preferência.' : 'Address ready. This browser did not allow saving your preference.')
      }
    } catch {
      setMessage(pt ? 'Informe um endereço HTTP ou HTTPS válido, incluindo a porta do servidor.' : 'Enter a valid HTTP or HTTPS address, including your server’s port.')
    }
  }

  return (
    <details className="local-preview">
      <summary>{pt ? 'Ver localmente' : 'Check locally'} · {settings.mode === 'localhost' ? 'localhost' : 'Tailscale'}</summary>
      <form onSubmit={save}>
        <p id={`${id}-help`} className="note">{pt ? 'Localhost abre neste dispositivo. Para outro computador, informe seu IP ou link Tailscale. O servidor precisa estar rodando.' : 'Localhost opens on this device. For another computer, enter its Tailscale IP or link. Your server must be running.'}</p>
        <label>{pt ? 'Conexão preferida' : 'Preferred connection'}
          <select value={settings.mode} onChange={(event) => setSettings({ ...settings, mode: event.target.value })}>
            <option value="localhost">Localhost</option><option value="tailscale">Tailscale</option>
          </select>
        </label>
        <label>{pt ? 'URL e porta localhost' : 'Localhost URL and port'}
          <input aria-describedby={`${id}-help`} value={settings.localhost} onChange={(event) => setSettings({ ...settings, localhost: event.target.value })} placeholder="http://localhost:3100" spellCheck={false} autoCapitalize="none" />
        </label>
        <label>{pt ? 'IP ou link Tailscale' : 'Tailscale IP or link'}
          <input aria-describedby={`${id}-help`} value={settings.tailscale} onChange={(event) => setSettings({ ...settings, tailscale: event.target.value })} placeholder="http://100.x.y.z:3100 or https://your-host.ts.net" spellCheck={false} autoCapitalize="none" />
        </label>
        <div className="header-actions">
          <button type="submit">{pt ? 'Salvar preferência' : 'Save preference'}</button>
          {href && <a href={href} target="_blank" rel="noreferrer">{pt ? 'Abrir' : 'Open'} {settings.mode === 'localhost' ? 'localhost' : 'Tailscale'} ↗</a>}
        </div>
        {href && <p className="note preview-address">{href}</p>}
        <p role="status">{message}</p>
      </form>
    </details>
  )
}

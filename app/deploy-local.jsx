'use client'

import React, { useState } from 'react'
import { siteRepositoryUrl } from '../lib/review-site.mjs'

export function DeployLocal({ locale = 'en' }) {
  const pt = locale === 'pt-BR'
  const command = 'npm install && npm run deploy:local'
  const [message, setMessage] = useState('')
  async function copy() {
    try {
      await navigator.clipboard.writeText(command)
      setMessage(pt ? 'Comando copiado.' : 'Command copied.')
    } catch {
      setMessage(pt ? 'Selecione e copie o comando abaixo.' : 'Select and copy the command below.')
    }
  }
  return (
    <details className="local-preview deploy-local">
      <summary>{pt ? 'Rodar localmente' : 'Deploy locally'}</summary>
      <div className="deploy-instructions">
        <p>{pt ? 'Clone o repositório e execute este comando na pasta do projeto com Node.js 24 ou mais recente.' : 'Clone the repository, then run this command in its folder with Node.js 24 or newer.'}</p>
        <pre><code>{command}</code></pre>
        <button type="button" onClick={copy}>{pt ? 'Copiar comando' : 'Copy command'}</button>
        <p className="note">{pt ? 'Abre em http://localhost:3100. Para Tailscale, use --host com o IP do computador. Este botão fornece as instruções; execute-as no computador de desenvolvimento.' : 'Serves at http://localhost:3100. For Tailscale, pass --host with your computer’s IP. Run these instructions on your development computer.'}</p>
        <a href={`${siteRepositoryUrl}/blob/HEAD/docs/local-development.md`}>{pt ? 'Instalação, portas e Tailscale' : 'Setup, ports and Tailscale'}</a>
        <p role="status">{message}</p>
      </div>
    </details>
  )
}

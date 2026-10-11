'use client'

import React, { useEffect, useState } from 'react'

export function RevisionDecision({ revision }) {
  const fingerprint = revision.commits.map((commit) => commit.id).join(',') || revision.pullRequest
  const storageKey = `orca-decision:${revision.slug}:${fingerprint}`
  const [decision, setDecision] = useState('pendente')
  const [reason, setReason] = useState('')
  const [message, setMessage] = useState('')
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null')
      if (
        saved &&
        typeof saved.reason === 'string' &&
        ['pendente', 'aprovar', 'revisar', 'descartar'].includes(saved.decision)
      ) {
        // oxlint-disable-next-line react/set-state-in-effect -- Restore browser storage only after server hydration.
        setDecision(saved.decision)
        setReason(saved.reason)
        setMessage('Registro recuperado deste navegador.')
      }
    } catch {
      setMessage('Não foi possível recuperar o registro local.')
    }
  }, [storageKey])
  function record() {
    return {
      revision: revision.slug,
      commits: revision.commits,
      decision,
      reason,
      recordedAt: new Date().toISOString()
    }
  }
  function save(event) {
    event.preventDefault()
    try {
      localStorage.setItem(storageKey, JSON.stringify(record()))
      setMessage('Decisão salva neste navegador para estes commits.')
    } catch {
      setMessage('Não foi possível salvar. Exporte o registro para guardar sua decisão.')
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(record(), null, 2)], { type: 'application/json' })
    )
    const link = document.createElement('a')
    link.href = url
    link.download = `decisao-${revision.slug}.json`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <section className="decision-record" aria-labelledby="decision-title">
      <h2 id="decision-title">Sua decisão</h2>
      <p className="note">
        Salva neste navegador, vinculada aos commits abaixo. Uma versão nova começa sem decisão.
        Exporte para guardar uma cópia ou levar a outro dispositivo.
      </p>
      <p className="decision-commits">
        <code>{fingerprint}</code>
      </p>
      <form onSubmit={save}>
        <label>
          Resultado
          <select value={decision} onChange={(event) => setDecision(event.target.value)}>
            <option value="pendente">Ainda avaliando</option>
            <option value="aprovar">Aprovar esta versão</option>
            <option value="revisar">Precisa de ajustes</option>
            <option value="descartar">Descartar esta versão</option>
          </select>
        </label>
        <label>
          Motivo e pendências
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={4}
            maxLength={6000}
          />
        </label>
        <div className="decision-actions">
          <button type="submit">Salvar decisão</button>
          <button type="button" onClick={download}>
            Exportar JSON
          </button>
        </div>
        <p role="status">{message}</p>
      </form>
    </section>
  )
}

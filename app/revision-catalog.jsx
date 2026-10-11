'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatRecordedDate, revisionHref } from '../lib/revisions.mjs'

export function RevisionCatalog({ revisions }) {
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState('')
  useEffect(() => {
    const restore = () => {
      const params = new URLSearchParams(window.location.search)
      setQuery(params.get('q') || '')
      setKind(params.get('tipo') || '')
    }
    restore()
    window.addEventListener('popstate', restore)
    return () => window.removeEventListener('popstate', restore)
  }, [])
  function updateFilters(nextQuery, nextKind) {
    setQuery(nextQuery)
    setKind(nextKind)
    const url = new URL(window.location.href)
    for (const [key, value] of [
      ['q', nextQuery],
      ['tipo', nextKind]
    ]) {
      if (value) {
        url.searchParams.set(key, value)
      } else {
        url.searchParams.delete(key)
      }
    }
    window.history.replaceState(null, '', url)
  }
  const kinds = [...new Set(revisions.map((revision) => revision.kind))]
  const normalize = (value) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  const needle = normalize(query.trim())
  const visible = revisions.filter((revision) => {
    const haystack = normalize(
      [
        revision.title,
        revision.summary,
        revision.repository ?? '',
        revision.status,
        ...revision.branches,
        ...revision.commits.map((commit) => commit.id),
        revision.pullRequest ?? '',
        revision.issue ?? '',
        revision.issueDraft?.problem ?? ''
      ].join(' ')
    )
    return (!kind || revision.kind === kind) && haystack.includes(needle)
  })

  return (
    <section aria-label="Catálogo de revisões">
      <div className="catalog-tools">
        <label className="search-field">
          Buscar revisões
          <input
            type="search"
            value={query}
            onChange={(event) => updateFilters(event.target.value, kind)}
            placeholder="Título, branch, commit ou PR"
          />
        </label>
        <label>
          Tipo de revisão
          <select value={kind} onChange={(event) => updateFilters(query, event.target.value)}>
            <option value="">Todos os tipos</option>
            {kinds.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="catalog-count" role="status">
        {visible.length} de {revisions.length} revisões
      </p>
      {visible.length === 0 ? (
        <div className="empty-media">
          <h2>
            {revisions.length === 0 ? 'Nenhuma revisão cadastrada' : 'Nenhuma revisão encontrada'}
          </h2>
          <p>
            {revisions.length === 0
              ? 'As próximas revisões aparecerão aqui quando forem cadastradas.'
              : 'Tente outro título, branch ou tipo de revisão.'}
          </p>
          {revisions.length > 0 && (
            <button
              onClick={() => {
                updateFilters('', '')
              }}
            >
              Limpar busca e filtros
            </button>
          )}
        </div>
      ) : (
        <div className="review-list">
          {visible.map((revision) => (
            <article className="review-row" key={revision.slug}>
              <div className="review-summary">
                <p className="review-kind">
                  {revision.kind}
                  {revision.repository && (
                    <>
                      {' '}
                      ·{' '}
                      <a href={`https://github.com/${revision.repository}`}>
                        {revision.repository}
                      </a>
                    </>
                  )}
                </p>
                <h2>
                  <Link href={revisionHref(revision)}>{revision.title}</Link>
                </h2>
                <p>{revision.summary}</p>
                <div className="branch-list">
                  {revision.branches.map((branch) => (
                    <code key={branch}>{branch}</code>
                  ))}
                </div>
              </div>
              <div className="review-state">
                <p>{revision.status}</p>
                {revision.pullRequest ? (
                  <a href={revision.pullRequest}>Abrir PR</a>
                ) : revision.issue ? (
                  <a href={revision.issue}>Abrir issue</a>
                ) : revision.issueDraft ? (
                  <p className="note">Rascunho de issue · ainda não publicado</p>
                ) : (
                  <p className="note">
                    Commit <code>{revision.commits[0].id}</code>
                  </p>
                )}
                {revision.recordedAt && (
                  <p className="note">
                    Registro de{' '}
                    <time dateTime={revision.recordedAt}>
                      {formatRecordedDate(revision.recordedAt)}
                    </time>
                  </p>
                )}
                <Link className="reading-link" href={revisionHref(revision)}>
                  Ler revisão<span className="sr-only">: {revision.title}</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

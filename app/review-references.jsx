import React from 'react'
import { repositoryHref, commitHref } from '../lib/review-references.mjs'

export function ReviewReferences({ revision, locale = 'pt-BR' }) {
  const pt = locale === 'pt-BR'
  const repository = repositoryHref(revision)
  return (
    <div className="review-references" aria-label={pt ? 'Referências da mudança' : 'Change references'}>
      <div className="reference-links">
        {repository && <a href={repository}>{revision.repository}</a>}
        {revision.pullRequest && <a href={revision.pullRequest}>{pt ? 'Abrir PR' : 'Open PR'} #{revision.pullRequest.split('/').at(-1)}</a>}
        {revision.issue && <a href={revision.issue}>{pt ? 'Abrir issue' : 'Open issue'} #{revision.issue.split('/').at(-1)}</a>}
      </div>
      <ul>
        {revision.commits.map((commit) => (
          <li key={commit.id}>
            {commitHref(revision, commit) ? <a href={commitHref(revision, commit)}><code>{commit.id}</code></a> : <code>{commit.id}</code>}
            <span>{commit.label}</span>
          </li>
        ))}
      </ul>
      {!repository && revision.commits.length > 0 && <p className="note">{pt ? 'Commits locais. Links públicos disponíveis após publicar as branches.' : 'Local commits. Public links will be available once the branches are published.'}</p>}
    </div>
  )
}

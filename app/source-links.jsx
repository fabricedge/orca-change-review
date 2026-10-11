'use client'

import React from 'react'
import { useI18n } from './i18n-provider'
import { siteRepositoryUrl } from '../lib/review-site.mjs'

export function SourceLinks() {
  const { messages: t } = useI18n()
  const commit = process.env.NEXT_PUBLIC_SITE_COMMIT || ''
  const url = siteRepositoryUrl
  return (
    <nav className="source-links" aria-label={t.sourceCode}>
      <a href={url} target="_blank" rel="noreferrer">
        {t.siteRepository}
      </a>
      {/^[a-f0-9]{7,40}$/.test(commit) && (
        <a href={`${url}/commit/${commit}`} target="_blank" rel="noreferrer">
          {t.siteCommit} <code>{commit.slice(0, 7)}</code>
        </a>
      )}
    </nav>
  )
}

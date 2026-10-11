'use client'
import React from 'react'
import { useI18n } from './i18n-provider'

export function ReviewDisclaimer() {
  const { messages: t } = useI18n()
  return (
    <aside className="review-disclaimer" aria-label={t.evidenceNoticeTitle}>
      <strong>{t.evidenceNoticeTitle}</strong>
      <p>{t.evidenceNotice}</p>
    </aside>
  )
}

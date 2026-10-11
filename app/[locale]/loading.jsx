'use client'
import React from 'react'
import { useI18n } from '../i18n-provider'
export default function Loading() {
  const { messages: t } = useI18n()
  return (
    <main>
      <p role="status">{t.loading}</p>
    </main>
  )
}

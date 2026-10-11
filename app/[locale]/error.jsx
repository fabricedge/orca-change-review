'use client'
import React from 'react'
import { useI18n } from '../i18n-provider'
export default function Error({ reset }) {
  const { messages: t } = useI18n()
  return (
    <main>
      <h1>{t.errorTitle}</h1>
      <p>{t.errorBody}</p>
      <button onClick={reset}>{t.retry}</button>
    </main>
  )
}

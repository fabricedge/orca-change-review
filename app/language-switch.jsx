'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { locales, languageNames, localePath } from '../lib/i18n.mjs'
import { useI18n } from './i18n-provider'
export function LanguageSwitch() {
  const { locale, messages } = useI18n()
  const router = useRouter()
  return (
    <label className="language-switch">
      {messages.language}
      <select
        value={locale}
        onChange={(event) =>
          router.push(`${localePath(event.target.value)}${window.location.hash}`)
        }
      >
        {locales.map((language) => (
          <option key={language} value={language} lang={language}>
            {languageNames[language]}
          </option>
        ))}
      </select>
    </label>
  )
}

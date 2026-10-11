'use client'
import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { locales, languageNames, localePath } from '../lib/i18n.mjs'
import { useI18n } from './i18n-provider'
export function LanguageSwitch() {
  const { locale, messages } = useI18n()
  const router = useRouter()
  const pathname = usePathname()
  return (
    <label className="language-switch">
      {messages.language}
      <select
        value={locale}
        onChange={(event) =>
          router.push(
            `${pathname?.startsWith(`/${locale}/`) ? pathname.replace(`/${locale}/`, `/${event.target.value}/`) : localePath(event.target.value)}${window.location.search}${window.location.hash}`
          )
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

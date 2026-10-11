'use client'
import React, { createContext, useContext, useMemo } from 'react'
import { getMessages } from '../lib/i18n.mjs'
const I18nContext = createContext({ locale: 'en', messages: getMessages('en') })
export function I18nProvider({ locale, children }) {
  const value = useMemo(() => ({ locale, messages: getMessages(locale) }), [locale])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
export function useI18n() {
  return useContext(I18nContext)
}

import React from 'react'
import { notFound } from 'next/navigation'
import { locales, getMessages } from '../../lib/i18n.mjs'
import { I18nProvider } from '../i18n-provider'
import '../globals.css'
import { sitePath } from '../../lib/site-path.mjs'
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}
export const dynamicParams = false
export async function generateMetadata({ params }) {
  const { locale } = await params
  const messages = getMessages(locale)
  return {
    title: messages.title,
    description: messages.description,
    alternates: {
      languages: { en: sitePath('/en/tab-copy/'), 'pt-BR': sitePath('/pt-BR/tab-copy/') }
    }
  }
}
export default async function Layout({ children, params }) {
  const { locale } = await params
  if (!locales.includes(locale)) {
    notFound()
  }
  return (
    <html lang={locale}>
      <body>
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </body>
    </html>
  )
}

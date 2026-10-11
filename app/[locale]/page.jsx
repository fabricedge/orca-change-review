import React from 'react'
import Link from 'next/link'
import { sitePath } from '../../lib/site-path.mjs'
export default async function LocalePage({ params }) {
  const { locale } = await params
  return (
    <main>
      <meta httpEquiv="refresh" content={`0;url=${sitePath(`/${locale}/tab-copy/`)}`} />
      <Link href={`/${locale}/tab-copy/`}>Open change review</Link>
    </main>
  )
}

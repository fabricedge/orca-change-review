import React from 'react'
import Link from 'next/link'
import { I18nProvider } from '../i18n-provider'
import '../globals.css'
import './reviews.css'

export const metadata = {
  title: 'Revisões do Orca',
  description: 'Branches, PRs, testes e demonstrações para revisar mudanças do Orca.'
}

export default function ReviewsLayout({ children }) {
  return (
    <html lang="pt-BR" className="reviews-root">
      <body>
        <a className="skip-link" href="#main-content">
          Pular para o conteúdo
        </a>
        <header className="site-header">
          <Link className="site-name" href="/revisoes">
            Orca / mudanças
          </Link>
          <nav aria-label="Navegação principal">
            <Link href="/revisoes">Revisões</Link>
            <Link href="/en/tab-copy">Tab copy</Link>
          </nav>
        </header>
        <main id="main-content" tabIndex={-1}>
          <I18nProvider locale="pt-BR">{children}</I18nProvider>
        </main>
      </body>
    </html>
  )
}

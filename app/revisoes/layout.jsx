import React from 'react'
import Link from 'next/link'
import { I18nProvider } from '../i18n-provider'
import { SourceLinks } from '../source-links'
import { ReviewDisclaimer } from '../review-disclaimer'
import '../globals.css'
import './reviews.css'
import { ReviewIdentity, CreateReviewLink } from '../review-identity'
import { siteRepositoryUrl } from '../../lib/review-site.mjs'

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
          <ReviewIdentity locale="pt-BR" />
          <nav aria-label="Navegação principal">
            <Link href="/revisoes">Revisões</Link>
            <Link href="/en/tab-copy">Tab copy</Link>
            <Link href="/pt-BR/workflow">Testes & MCP</Link>
            <CreateReviewLink locale="pt-BR" />
            <a href={siteRepositoryUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </nav>
        </header>
        <main id="main-content" tabIndex={-1}>
          <I18nProvider locale="pt-BR">
            <ReviewDisclaimer />
            {children}
            <SourceLinks />
          </I18nProvider>
        </main>
      </body>
    </html>
  )
}

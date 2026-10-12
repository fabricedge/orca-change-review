import React from 'react'
import { I18nProvider } from '../i18n-provider'
import { SourceLinks } from '../source-links'
import { ReviewDisclaimer } from '../review-disclaimer'
import '../globals.css'
import './reviews.css'
import '../site-style.css'
import { SiteStyleBootstrap } from '../site-style-bootstrap'
import { SiteHeader } from '../site-header'

export const metadata = {
  title: 'Revisões do Orca',
  description: 'Branches, PRs, testes e demonstrações para revisar mudanças do Orca.'
}

export default function ReviewsLayout({ children }) {
  return (
    <html lang="pt-BR" className="reviews-root" data-site-style="showcase" suppressHydrationWarning>
      <head><SiteStyleBootstrap /></head>
      <body>
        <a className="skip-link" href="#main-content">
          Pular para o conteúdo
        </a>
        <SiteHeader locale="pt-BR" languageSwitch={false} />
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

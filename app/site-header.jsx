import React from 'react'
import Link from 'next/link'
import { ReviewIdentity, CreateReviewLink } from './review-identity'
import { LanguageSwitch } from './language-switch'
import { LocalPreview } from './local-preview'
import { DeployLocal } from './deploy-local'
import { SiteStyle } from './site-style'
import { siteRepositoryUrl, siteVersion } from '../lib/review-site.mjs'

export function SiteHeader({ locale = 'en', active = 'catalog', languageSwitch = true }) {
  const pt = locale === 'pt-BR'
  const links = [
    ['catalog', '/revisoes', pt ? 'Catálogo de evidências' : 'Evidence catalog', pt ? 'Encontre testes, PRs e commits' : 'Find tests, PRs and commits'],
    ['comparison', `/${locale}/tab-copy`, pt ? 'Compare o tab copy' : 'Compare tab copy', pt ? 'Assista às três alternativas' : 'Watch the three alternatives'],
    ['workflow', `/${locale}/workflow`, pt ? 'Grave seu teste' : 'Record your test', pt ? 'Configure o MCP e publique evidências' : 'Set up MCP and publish evidence']
  ]
  return (
    <header className="site-header review-header">
      <div className="header-introduction">
        <ReviewIdentity locale={locale} />
        <a
          href={`${siteRepositoryUrl}/blob/HEAD/CHANGELOG.md`}
          aria-label={pt ? `Versão do site ${siteVersion}. Ver histórico de mudanças` : `Website version ${siteVersion}. View changelog`}
        >
          v{siteVersion} · {pt ? 'Histórico de mudanças' : 'Changelog'}
        </a>
        <p>{pt ? 'Veja o Orca em ação. Acompanhe cada mudança do código ao teste gravado.' : 'See Orca in action. Follow each change from its code to the recorded test.'}</p>
      </div>
      <div className="header-actions">
        <SiteStyle locale={locale} />
        <LocalPreview locale={locale} />
        <DeployLocal locale={locale} />
        {languageSwitch && <LanguageSwitch />}
        <CreateReviewLink locale={locale} />
        <a href={siteRepositoryUrl}>{pt ? 'Código e instruções' : 'Source and instructions'}</a>
      </div>
      <nav className="review-navigation" aria-label={pt ? 'Navegação principal' : 'Main navigation'}>
        {links.map(([id, href, title, description]) => (
          <Link key={id} href={href} aria-current={id === active ? 'page' : undefined}>
            <strong>{title}</strong><small>{description}</small>
          </Link>
        ))}
      </nav>
    </header>
  )
}

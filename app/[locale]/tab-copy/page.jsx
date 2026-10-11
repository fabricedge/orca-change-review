import React from 'react'
import { variants } from '../../../lib/tab-copy-variants.mjs'
import { readImportedMedia } from '../../../lib/read-imported-media.mjs'
import { getMessages } from '../../../lib/i18n.mjs'
import { VideoPlayer } from '../../video-player'
import { LanguageSwitch } from '../../language-switch'
import Link from 'next/link'
import { ReviewIdentity, CreateReviewLink } from '../../review-identity'
import { PageDates } from '../../page-dates'
import { siteRepositoryUrl } from '../../../lib/review-site.mjs'

export default async function Page({ params }) {
  const { locale } = await params
  const t = getMessages(locale)
  const translatedVariants = variants.map((variant, index) => ({
    ...variant,
    ...t.variants[index],
    commits: variant.commits.map((commit, commitIndex) => ({
      ...commit,
      label: t.variants[index].commits[commitIndex]
    }))
  }))
  const media = await readImportedMedia()
  return (
    <>
      <a className="skip-link" href="#versions">
        {t.skip}
      </a>
      <header className="site-header">
        <ReviewIdentity locale={locale} />
        <div className="header-actions">
          <Link href="/revisoes">{t.reviews}</Link>
          <Link href={`/${locale}/workflow`}>{t.testWorkflow}</Link>
          <a href={siteRepositoryUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="#versions">{t.tabCopy}</a>
          <LanguageSwitch />
          <CreateReviewLink locale={locale} />
        </div>
      </header>
      <main>
        <div className="intro">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.heading}</h1>
          <PageDates locale={locale} />
          <p>{t.intro}</p>
          <p className="note">
            {media.captureKind === 'orca-app' ? t.fullCapture : t.isolatedCapture}
          </p>
        </div>
        <nav className="version-nav" aria-label={t.versions}>
          {translatedVariants.map((variant, index) => (
            <a key={variant.id} href={`#${variant.id}`}>
              <span>0{index + 1}</span>
              {variant.title}
            </a>
          ))}
        </nav>
        <div id="versions">
          {translatedVariants.map((variant, index) => {
            const assets = media.variants[variant.id] ?? {}
            return (
              <article id={variant.id} className="variant" key={variant.id}>
                <div className="variant-heading">
                  <span className="number">0{index + 1}</span>
                  <div>
                    <h2>{variant.title}</h2>
                    <p>{variant.description}</p>
                  </div>
                </div>
                <VideoPlayer video={assets.video} poster={assets.menu} title={variant.title} />
                <p className="video-description">{variant.behavior}</p>
                <div className="variant-footer">
                  <div className="commits">
                    <code>{variant.branch}</code>
                    <ul>
                      {variant.commits.map((commit) => (
                        <li key={commit.id}>
                          <code>{commit.id}</code>
                          <span>{commit.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="downloads">
                    {assets.video && (
                      <a href={assets.video} download>
                        {t.download}
                      </a>
                    )}
                    {assets.copied && (
                      <a href={assets.copied} target="_blank" rel="noreferrer">
                        {t.copied}
                      </a>
                    )}
                  </div>
                </div>
                {(assets.menu || assets.tooltip) && (
                  <details>
                    <summary>{t.screenshots}</summary>
                    <div className="screenshots">
                      {[
                        ['menu', t.menu],
                        ['tooltip', t.tooltip]
                      ].map(
                        ([key, label]) =>
                          assets[key] && (
                            <a key={key} href={assets[key]} target="_blank" rel="noreferrer">
                              <figure>
                                <img
                                  src={assets[key]}
                                  alt={`${label}: ${variant.title}`}
                                  loading="lazy"
                                />
                                <figcaption>{label}</figcaption>
                              </figure>
                            </a>
                          )
                      )}
                    </div>
                  </details>
                )}
              </article>
            )
          })}
        </div>
        <footer>
          <p>
            {t.newRecordings} <code>npm run import:orca</code> {t.refresh}
          </p>
          <a href="#versions">{t.back}</a>
        </footer>
      </main>
    </>
  )
}

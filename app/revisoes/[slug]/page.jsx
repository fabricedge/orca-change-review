import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { findRevision, formatRecordedDate } from '../../../lib/revisions.mjs'
import { readImportedMedia } from '../../../lib/read-imported-media.mjs'
import { variants } from '../../../lib/tab-copy-variants.mjs'
import { TabComparison } from '../../tab-comparison'
import { VariantCompare } from '../../variant-compare'
import { RevisionDecision } from '../../revision-decision'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const revision = findRevision((await params).slug)
  return revision
    ? { title: `${revision.title} | Revisões do Orca`, description: revision.summary }
    : { title: 'Revisão não encontrada' }
}

export default async function RevisionPage({ params }) {
  const revision = findRevision((await params).slug)
  if (!revision) {
    notFound()
  }
  const media = revision.comparison ? await readImportedMedia() : null
  const items = revision.variantIds
    ? variants.filter((item) => revision.variantIds.includes(item.id))
    : variants
  const navigation = revision.comparison
    ? items.map((variant) => ({ id: variant.id, title: variant.title }))
    : revision.sections

  return (
    <>
      <div className="intro review-intro">
        <Link className="back-link" href="/revisoes">
          Todas as revisões
        </Link>
        <p className="review-kind">
          {revision.kind} · {revision.status}
        </p>
        <h1>{revision.title}</h1>
        <p>{revision.summary}</p>
        <p className="implementation-note">{revision.implementation}</p>
        {revision.recordedAt && (
          <p className="note">
            Registro de{' '}
            <time dateTime={revision.recordedAt}>{formatRecordedDate(revision.recordedAt)}</time>.
            Consulte o PR para ver o estado atual.
          </p>
        )}
        {revision.pullRequest && (
          <a className="reading-link" href={revision.pullRequest}>
            Abrir PR no GitHub
          </a>
        )}
        {revision.commits.length > 0 && (
          <section aria-label="Referências da mudança">
            <h2>Commits desta mudança</h2>
            <ul>
              {revision.commits.map((commit) => (
                <li key={commit.id}>
                  {revision.repository ? (
                    <a href={`https://github.com/${revision.repository}/commit/${commit.id}`}>
                      <code>{commit.id}</code>
                    </a>
                  ) : (
                    <code>{commit.id}</code>
                  )}
                  <span>{commit.label}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      <nav className="version-nav" aria-label="Nesta revisão">
        {navigation.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            {section.title}
          </a>
        ))}
      </nav>
      {revision.comparison ? (
        <>
          {items.length > 1 && <VariantCompare media={media} />}
          <TabComparison media={media} items={items} />
        </>
      ) : (
        <div className="reading-layout">
          <div className="reading-content">
            {revision.sections.map((section) => (
              <section id={section.id} className="reading-section" key={section.id}>
                <h2>{section.title}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.files && (
                  <ul className="file-list">
                    {section.files.map((file) => (
                      <li key={file.path}>
                        <a
                          href={`https://github.com/${revision.repository}/blob/${revision.commits[0]?.id ?? revision.base ?? 'HEAD'}/${file.path}`}
                        >
                          <code>{file.path}</code>
                        </a>
                        <p>{file.description}</p>
                      </li>
                    ))}
                  </ul>
                )}
                {section.code && (
                  <figure className="command-block">
                    {section.codeCaption && <figcaption>{section.codeCaption}</figcaption>}
                    <pre>
                      <code>{section.code}</code>
                    </pre>
                  </figure>
                )}
                {section.items && (
                  <ul className="reading-list">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
          <aside className="branch-record" aria-label="Identificação da branch">
            <h2>Branch e commit</h2>
            <dl>
              <dt>Repositório</dt>
              <dd>{revision.repository}</dd>
              <dt>Base</dt>
              <dd>
                <code>{revision.base ?? 'Não registrada'}</code>
              </dd>
              <dt>Branch</dt>
              <dd>
                <code>{revision.branches[0] ?? 'Não registrada'}</code>
              </dd>
              {revision.commits.length > 0 && (
                <>
                  <dt>Commit registrado</dt>
                  <dd>
                    <a
                      href={`https://github.com/${revision.repository}/commit/${revision.commits[0].id}`}
                    >
                      <code>{revision.commits[0].id.slice(0, 12)}</code>
                    </a>
                  </dd>
                </>
              )}
            </dl>
            <p className="note">
              As verificações se referem a este commit. Não há atualização automática do GitHub.
            </p>
          </aside>
        </div>
      )}
      <RevisionDecision key={revision.slug} revision={revision} />
      <footer>
        <Link href="/revisoes">Voltar às revisões</Link>
        <a href="#main-content">Voltar ao início</a>
      </footer>
    </>
  )
}

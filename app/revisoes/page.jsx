import React from 'react'
import { revisions } from '../../lib/revisions.mjs'
import { RevisionCatalog } from '../revision-catalog'
import { PageDates } from '../page-dates'

export default function ReviewsPage() {
  return (
    <>
      <div className="intro">
        <h1>Evidências de testes e features do Orca</h1>
        <PageDates locale="pt-BR" />
        <p>
          Veja vídeos automatizados do Orca, o comportamento testado, os resultados registrados e o
          que falta validar. Use essas evidências junto da revisão do PR no GitHub.
        </p>
      </div>
      <RevisionCatalog revisions={revisions} />
      <footer>
        <p>Registros locais. O estado dos PRs não é sincronizado com o GitHub.</p>
      </footer>
    </>
  )
}

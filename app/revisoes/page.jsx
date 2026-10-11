import React from 'react'
import { revisions } from '../../lib/revisions.mjs'
import { RevisionCatalog } from '../revision-catalog'

export default function ReviewsPage() {
  return (
    <>
      <div className="intro">
        <h1>Revisões do Orca</h1>
        <p>
          Encontre uma branch e veja o que mudou, as evidências disponíveis e o que falta validar.
        </p>
      </div>
      <RevisionCatalog revisions={revisions} />
      <footer>
        <p>Registros locais. O estado dos PRs não é sincronizado com o GitHub.</p>
      </footer>
    </>
  )
}

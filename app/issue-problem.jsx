import React from 'react'

export function IssueProblem({ draft }) {
  return (
    <section className="reading-section" aria-label="Problema da issue">
      <h2>O problema antes da solução</h2>
      <p className="note">Rascunho local. Publicar uma issue é uma ação separada.</p>
      {[
        ['Problema', draft.problem],
        ['Impacto no workflow', draft.impact],
        ['Comportamento atual', draft.observed],
        ['Resultado esperado', draft.expected],
        ['Diretrizes consultadas', draft.guidelinesSource]
      ].map(([label, value]) => (
        <div key={label}>
          <h3>{label}</h3>
          <p>{value}</p>
        </div>
      ))}
      {draft.reproduction.length > 0 && (
        <>
          <h3>Como reproduzir</h3>
          <ol className="workflow-steps">
            {draft.reproduction.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </>
      )}
      {draft.proposal && (
        <>
          <h3>Proposta, separada do problema</h3>
          <p>{draft.proposal}</p>
        </>
      )}
    </section>
  )
}

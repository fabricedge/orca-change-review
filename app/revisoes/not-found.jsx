import React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="intro">
      <h1>Revisão não encontrada</h1>
      <p>Este endereço não corresponde a uma revisão cadastrada.</p>
      <Link className="reading-link" href="/revisoes">
        Ver todas as revisões
      </Link>
    </div>
  )
}

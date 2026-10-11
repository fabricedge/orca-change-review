import React from 'react'
import Link from 'next/link'
export default function HomePage() {
  return (
    <main>
      <h1>Orca change review</h1>
      <Link href="/en/tab-copy/">Open change review</Link>
      <p>
        <Link href="/revisoes/">Browse all changes</Link>
      </p>
    </main>
  )
}

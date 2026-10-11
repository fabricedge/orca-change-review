import React from 'react'
import '../globals.css'
import { sitePath } from '../../lib/site-path.mjs'

export default function HomeLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="refresh" content={`0;url=${sitePath('/en/tab-copy/')}`} />
      </head>
      <body>{children}</body>
    </html>
  )
}

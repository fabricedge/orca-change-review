'use client'

import React, { useEffect, useState } from 'react'

const storageKey = 'orca-review:site-style:v1'

export function SiteStyle({ locale = 'en' }) {
  const pt = locale === 'pt-BR'
  const [style, setStyle] = useState('showcase')
  const [message, setMessage] = useState('')
  useEffect(() => {
    setStyle(document.documentElement.dataset.siteStyle === 'readme' ? 'readme' : 'showcase')
  }, [])
  function toggle() {
    const next = style === 'readme' ? 'showcase' : 'readme'
    document.documentElement.dataset.siteStyle = next
    setStyle(next)
    try {
      localStorage.setItem(storageKey, next)
      setMessage('')
    } catch {
      setMessage(pt ? 'Estilo alterado. Preferência não salva neste navegador.' : 'Style changed. This browser could not save the preference.')
    }
  }
  return (
    <div className="site-style-control">
      <button type="button" onClick={toggle} aria-pressed={style === 'readme'}>
        {style === 'readme' ? (pt ? 'Voltar ao visual do site' : 'Back to website style') : (pt ? 'Modo README' : 'README mode')}
      </button>
      {message && <p role="status" className="note">{message}</p>}
    </div>
  )
}

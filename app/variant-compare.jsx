'use client'

import React, { useState } from 'react'
import { variants } from '../lib/tab-copy-variants.mjs'
import { VideoPlayer } from './video-player'

export function VariantCompare({ media }) {
  const [left, setLeft] = useState(variants[0].id)
  const [right, setRight] = useState(variants[1].id)
  function choose(side, id) {
    if (side === 0) {
      if (id === right) {
        setRight(left)
      }
      setLeft(id)
    } else {
      if (id === left) {
        setLeft(right)
      }
      setRight(id)
    }
  }
  return (
    <section className="comparison-panel" aria-labelledby="compare-title">
      <h2 id="compare-title">Compare duas alternativas</h2>
      <p>
        Use os mesmos critérios: ação no menu, contexto copiado e o que a gravação comprova. Os
        vídeos têm tempos próprios.
      </p>
      <div className="comparison-columns">
        {[left, right].map((id, side) => {
          const variant = variants.find((item) => item.id === id)
          const assets = media.variants[id] || {}
          return (
            <div className="comparison-choice" key={side}>
              <label>
                Alternativa {side === 0 ? 'A' : 'B'}
                <select value={id} onChange={(event) => choose(side, event.target.value)}>
                  {variants.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>
              <h3>{variant.title}</h3>
              <dl>
                <dt>Ação e contexto</dt>
                <dd>{variant.description}</dd>
                <dt>Evidência disponível</dt>
                <dd>{variant.behavior}</dd>
                <dt>Commits registrados</dt>
                <dd>
                  <code>{variant.commits.map((commit) => commit.id).join(' · ')}</code>
                </dd>
              </dl>
              <VideoPlayer
                key={id}
                video={assets.video}
                poster={assets.menu}
                title={variant.title}
              />
              <a className="reading-link" href={`#${id}`}>
                Ver capturas e histórico
              </a>
            </div>
          )
        })}
      </div>
    </section>
  )
}

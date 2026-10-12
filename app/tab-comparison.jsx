import React from 'react'
import { variants } from '../lib/tab-copy-variants.mjs'
import { VideoPlayer } from './video-player'
import { ReviewReferences } from './review-references'

export function TabComparison({ media, items = variants }) {
  return (
    <div id="versions">
      {items.map((variant, index) => {
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
                <ReviewReferences revision={{ commits: variant.commits }} />
              </div>
              <div className="downloads">
                {assets.video && (
                  <a href={assets.video} download>
                    Baixar vídeo
                  </a>
                )}
                {assets.copied && (
                  <a href={assets.copied} target="_blank" rel="noreferrer">
                    Ver resultado da cópia
                  </a>
                )}
              </div>
            </div>
            {(assets.menu || assets.tooltip) && (
              <details>
                <summary>Ver capturas de {variant.title}</summary>
                <div className="screenshots">
                  {[
                    ['menu', 'Menu da aba'],
                    ['tooltip', 'Instrução para o agente']
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
  )
}

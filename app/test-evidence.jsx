import React from 'react'
import { VideoPlayer } from './video-player'

const outcomes = {
  passed: 'Passou no escopo gravado',
  failed: 'Falhou',
  incomplete: 'Evidência incompleta',
  'not-run': 'Não executado'
}

export function TestEvidence({ evidence }) {
  return (
    <section className="reading-section" aria-label="Evidências do teste automatizado">
      <h2>Teste automatizado e gravação</h2>
      <p>
        <strong>{outcomes[evidence.outcome]}</strong> · <code>{evidence.testFile}</code>
      </p>
      <p>
        Execução registrada em <time dateTime={evidence.recordedAt}>{evidence.recordedAt}</time>
      </p>
      {evidence.sourceCommit && (
        <p>
          Commit de origem: <code>{evidence.sourceCommit}</code>
          {evidence.trackedChanges ? ' · havia alterações locais em arquivos rastreados' : ''}
        </p>
      )}
      {evidence.stats && (
        <p>
          Esperados: {evidence.stats.expected ?? 0} · Inesperados: {evidence.stats.unexpected ?? 0}{' '}
          · Ignorados: {evidence.stats.skipped ?? 0} · Flaky: {evidence.stats.flaky ?? 0}
        </p>
      )}
      <p className="note">{evidence.limitations}</p>
      {evidence.videoUrls.length === 0 ? (
        <p>Vídeo ainda não publicado. Consulte os artefatos locais da gravação.</p>
      ) : (
        evidence.videoUrls.map((video, index) => (
          <div key={video}>
            <VideoPlayer video={video} title={`${evidence.testFile} (${index + 1})`} />
            <a href={video}>Baixar vídeo {index + 1}</a>
          </div>
        ))
      )}
    </section>
  )
}

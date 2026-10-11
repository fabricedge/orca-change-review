'use client'

import React, { useState } from 'react'
import { useI18n } from './i18n-provider'

export function VideoPlayer({ video, poster, title }) {
  const [failed, setFailed] = useState(false)
  const { messages: t } = useI18n()
  if (!video) {
    return (
      <div className="empty-media">
        <p>{t.missingVideo}</p>
        <p>
          {t.record} <code>npm run import:orca</code>.
        </p>
      </div>
    )
  }
  return (
    <div className="player">
      <video
        controls
        playsInline
        preload="metadata"
        poster={poster}
        aria-label={`${t.demo}: ${title}`}
        onError={() => setFailed(true)}
      >
        <source src={video} type="video/webm" />
        {t.unsupported}
      </video>
      {failed && (
        <p role="alert">
          {t.failedVideo}{' '}
          <a href={video} download>
            {t.downloadWebm}
          </a>{' '}
          {t.watch}
        </p>
      )}
    </div>
  )
}

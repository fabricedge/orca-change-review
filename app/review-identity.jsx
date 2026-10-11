import React from 'react'
import { getMessages } from '../lib/i18n.mjs'
import { siteOwner, siteRepositoryUrl } from '../lib/review-site.mjs'

export function ReviewIdentity({ locale = 'en' }) {
  const t = getMessages(locale)
  return (
    <span className="review-identity">
      Orca Review Changes ·{' '}
      <a href={`https://github.com/${siteOwner}`} rel="noreferrer" target="_blank">
        @{siteOwner}
      </a>
      <span className="note">{t.personalReview}</span>
    </span>
  )
}

export function CreateReviewLink({ locale = 'en' }) {
  return (
    <a
      className="create-review"
      href={`${siteRepositoryUrl}#create-your-own-orca-review`}
      target="_blank"
      rel="noreferrer"
    >
      {getMessages(locale).createReview}
    </a>
  )
}

import React from 'react'
import { getMessages } from '../lib/i18n.mjs'
import { pageDates } from '../lib/review-site.mjs'

export function PageDates({ dates = pageDates, locale = 'en' }) {
  const t = getMessages(locale)
  const format = (value) =>
    new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'UTC'
    }).format(new Date(value))
  return (
    <dl className="page-dates">
      {[
        ['createdAt', t.createdAt],
        ['updatedAt', t.updatedAt]
      ].map(([key, label]) => (
        <div key={key}>
          <dt>{label}</dt>
          <dd>
            <time dateTime={dates[key]}>{format(dates[key])} UTC</time>
          </dd>
        </div>
      ))}
    </dl>
  )
}

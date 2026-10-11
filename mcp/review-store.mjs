import { readFile, writeFile, mkdir, rename, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { validateRevisions } from '../lib/validate-revisions.mjs'

export async function readReviews(site, builtIn) {
  const additional = JSON.parse(await readFile(join(site, 'data/reviews.json'), 'utf8'))
  if (!Array.isArray(additional)) {
    throw new Error('data/reviews.json must be an array')
  }
  return validateRevisions([...builtIn, ...additional])
}

export async function saveReview(site, builtIn, review, expectedUpdatedAt) {
  const directory = join(site, 'data')
  const lock = join(directory, '.review-write.lock')
  await mkdir(lock)
  let temporary
  try {
    const reviews = JSON.parse(await readFile(join(directory, 'reviews.json'), 'utf8'))
    if (builtIn.some((entry) => entry.slug === review.slug)) {
      throw new Error('Built-in review: edit lib/revisions.mjs instead')
    }
    const index = reviews.findIndex((entry) => entry.slug === review.slug)
    const previous = reviews[index]
    if (
      (previous && previous.updatedAt !== expectedUpdatedAt) ||
      (!previous && expectedUpdatedAt)
    ) {
      throw new Error('Review changed or no longer exists. Read it again before saving.')
    }
    const now = new Date().toISOString()
    const next = {
      ...review,
      ...(previous?.testEvidence && !review.testEvidence
        ? { testEvidence: previous.testEvidence }
        : {}),
      createdAt: previous?.createdAt ?? now,
      updatedAt: now
    }
    if (previous) {
      reviews[index] = next
    } else {
      reviews.push(next)
    }
    validateRevisions([...builtIn, ...reviews])
    temporary = join(directory, `.reviews-${randomUUID()}.json`)
    await writeFile(temporary, `${JSON.stringify(reviews, null, 2)}\n`, { flag: 'wx' })
    await rename(temporary, join(directory, 'reviews.json'))
    return next
  } finally {
    if (temporary) {
      await rm(temporary, { force: true })
    }
    await rm(lock, { recursive: true, force: true })
  }
}

export const siteRepository =
  process.env.NEXT_PUBLIC_SITE_REPOSITORY || 'fabricedge/orca-change-review'
export const siteOwner = siteRepository.split('/')[0]
export const siteRepositoryUrl = `https://github.com/${siteRepository}`

export const pageDates = {
  createdAt: '2026-10-11T22:50:12Z',
  updatedAt: '2026-10-11T23:28:26Z'
}

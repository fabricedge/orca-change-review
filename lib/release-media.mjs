export const mediaVariants = ['cli-only', 'split-control', 'two-columns']
export const mediaSuffixes = {
  video: '.webm',
  menu: '-menu.png',
  tooltip: '-tooltip.png',
  copied: '-copied.png'
}

export function releaseManifest(repository, tag, filenames, recordedAt) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository) || !tag || /[\s?#\\]/.test(tag)) {
    throw new Error(
      'Use OWNER/REPOSITORY and a release tag without whitespace or query characters.'
    )
  }
  const prefix = `https://github.com/${repository}/releases/download/${encodeURIComponent(tag)}/`
  const variants = Object.fromEntries(
    mediaVariants.map((id) => {
      const assets = {}
      for (const [key, suffix] of Object.entries(mediaSuffixes)) {
        const filename = `${id}${suffix}`
        if (filenames.includes(filename)) {
          assets[key] = `${prefix}${filename}`
        }
      }
      if (!assets.video) {
        throw new Error(`Missing complete-app video: ${id}.webm`)
      }
      return [id, assets]
    })
  )
  return { captureKind: 'orca-app', repository, tag, recordedAt, variants }
}

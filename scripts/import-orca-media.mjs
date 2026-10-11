import { cp, mkdir, access, writeFile, readFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { variants } from '../lib/tab-copy-variants.mjs'

const project = resolve(import.meta.dirname, '..')
try {
  await access(join(project, 'media/releases.json'))
  console.log('Using GitHub Releases media from media/releases.json. Local import skipped.')
  process.exit(0)
} catch (error) {
  if (error.code !== 'ENOENT') {
    throw error
  }
}
try {
  process.loadEnvFile(join(project, '.env.local'))
} catch (error) {
  if (error.code !== 'ENOENT') {
    throw error
  }
}
const source = resolve(process.env.ORCA_SOURCE ?? resolve(project, '../orca'))
const destination = join(project, 'public/media')
await mkdir(destination, { recursive: true })
const available = {}
let captureKind = 'isolated-components'
try {
  const capture = JSON.parse(
    await readFile(join(source, 'artifacts/tab-copy-prs/images/videos/capture.json'), 'utf8')
  )
  captureKind = capture.kind
} catch (error) {
  if (error.code !== 'ENOENT') {
    throw error
  }
}

async function copyIfPresent(from, to) {
  try {
    await access(from)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false
    }
    throw error
  }
  await cp(from, to)
  return true
}

for (const variant of variants) {
  const media = {}
  for (const [key, suffix] of Object.entries({
    video: '.webm',
    menu: '-menu.png',
    tooltip: '-tooltip.png',
    copied: '-copied.png'
  })) {
    if (captureKind !== 'orca-app') {
      continue
    }
    const filename = `${variant.id}${suffix}`
    if (
      await copyIfPresent(
        join(source, 'artifacts/tab-copy-prs/images/videos', filename),
        join(destination, filename)
      )
    ) {
      media[key] = `/media/${filename}?v=${Date.now()}`
    }
  }
  available[variant.id] = media
}

for (const filename of ['variants.bundle', 'videos.zip']) {
  await copyIfPresent(join(source, 'artifacts/tab-copy-prs', filename), join(destination, filename))
}
const fontDirectory = join(project, 'public/fonts')
await mkdir(fontDirectory, { recursive: true })
await copyIfPresent(
  join(source, 'src/renderer/src/assets/fonts/Geist-Variable.woff2'),
  join(fontDirectory, 'Geist-Variable.woff2')
)
await writeFile(
  join(destination, 'manifest.json'),
  JSON.stringify(
    { importedAt: new Date().toISOString(), captureKind, variants: available },
    null,
    2
  )
)
console.log(
  `Mídias importadas de ${source}. Vídeos: ${Object.values(available).filter((media) => media.video).length}/3.`
)

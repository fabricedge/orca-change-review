import { readFile, mkdir, cp, writeFile, stat } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { releaseManifest, mediaVariants, mediaSuffixes } from '../lib/release-media.mjs'

const [repository, tag, sourceArgument, outputArgument] = process.argv.slice(2)
if (!repository || !tag || !sourceArgument || !outputArgument) {
  throw new Error(
    'Usage: node scripts/prepare-release-media.mjs OWNER/REPO TAG VIDEO_DIRECTORY OUTPUT_DIRECTORY'
  )
}
const source = resolve(sourceArgument)
const output = resolve(outputArgument)
const capture = JSON.parse(await readFile(join(source, 'capture.json'), 'utf8'))
if (capture.kind !== 'orca-app') {
  throw new Error(
    'Only recordings of the complete Orca app can be published. Run record:orca first.'
  )
}
const files = []
for (const id of mediaVariants) {
  for (const [key, suffix] of Object.entries(mediaSuffixes)) {
    const filename = `${id}${suffix}`
    try {
      const info = await stat(join(source, filename))
      if (!info.isFile() || !info.size || info.size >= 2 ** 31) {
        throw new Error(`Asset must be a nonempty file smaller than 2 GiB: ${filename}`)
      }
      files.push(filename)
    } catch (error) {
      if (error.code === 'ENOENT' && key !== 'video') {
        continue
      }
      throw error
    }
  }
}
const manifest = releaseManifest(repository, tag, files, capture.recordedAt)
await mkdir(output, { recursive: true })
for (const filename of files) {
  await cp(join(source, filename), join(output, filename))
}
await writeFile(join(output, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Prepared ${files.length} assets and manifest.json in ${output}`)

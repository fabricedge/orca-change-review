import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export async function readImportedMedia() {
  try {
    return JSON.parse(await readFile(join(process.cwd(), 'media/releases.json'), 'utf8'))
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }
  }
  try {
    return JSON.parse(await readFile(join(process.cwd(), 'public/media/manifest.json'), 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { variants: {} }
    }
    throw error
  }
}

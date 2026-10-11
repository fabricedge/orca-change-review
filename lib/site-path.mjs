export function sitePath(path) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${path}`
}

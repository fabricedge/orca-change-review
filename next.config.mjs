import { hostname } from 'node:os'
const pages = process.env.ORCA_GITHUB_PAGES === '1'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export default {
  poweredByHeader: false,
  basePath,
  trailingSlash: true,
  ...(pages ? { output: 'export' } : {}),
  allowedDevOrigins: [
    '127.0.0.1',
    hostname(),
    '100.91.176.16',
    'fedora.tail8bca1e.ts.net',
    ...(process.env.ORCA_REVIEW_DEV_ORIGINS || '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  ],
  distDir: process.env.NEXT_DIST_DIR || '.next',
  ...(!pages
    ? {
        async redirects() {
          return [
            { source: '/', destination: '/revisoes', permanent: false },
            { source: '/:locale(en|pt-BR)', destination: '/:locale/tab-copy', permanent: false }
          ]
        }
      }
    : {})
}

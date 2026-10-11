import { hostname } from 'node:os'

export default {
  poweredByHeader: false,
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
  async redirects() {
    return [
      { source: '/', destination: '/revisoes', permanent: false },
      { source: '/:locale(en|pt-BR)', destination: '/:locale/tab-copy', permanent: false }
    ]
  }
}

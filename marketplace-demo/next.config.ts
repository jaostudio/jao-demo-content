import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, '..'),
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/products/peptide-bracelet.jpg',
        destination: '/products/mother-of-pearl-bracelet.jpg',
        permanent: true,
      },
    ]
  },
}

export default nextConfig

import type { NextConfig } from 'next'
import withBundleAnalyzer from '@next/bundle-analyzer'
import { withSentryConfig } from '@sentry/nextjs'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const csp = [
  "default-src 'self'",
  // NOTE: allowing 'unsafe-inline' and 'unsafe-eval' temporarily to avoid
  // blocking Next.js runtime inline scripts and injected scripts (vercel.live,
  // analytics, etc.). Replace with nonces/hashes for production-hardening.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://us.i.posthog.com",
  "frame-src 'self' https:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'report-uri /api/csp-report',
  'report-to csp-endpoint',
].join('; ')

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.vercel.app',
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/about',
        destination: '/studio',
        permanent: true,
      },
    ]
  },

  async headers() {
    const isPreview = process.env.VERCEL_ENV !== undefined && process.env.VERCEL_ENV !== 'production'
    // Treat only Vercel's production environment as production for headers.
    // During Vercel preview builds NODE_ENV is 'production', but VERCEL_ENV will be 'preview'.
    const isProd = process.env.VERCEL_ENV === 'production'
    const previewHeaders = isPreview ? [{ key: 'X-Robots-Tag', value: 'noindex' }] : []

    const baseHeaders = [
      ...previewHeaders,
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'X-Frame-Options', value: 'DENY' },
    ]

    // Only apply strict CSP and HSTS in production builds.
    if (isProd) {
      baseHeaders.unshift({ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' })
      baseHeaders.unshift({ key: 'Content-Security-Policy', value: csp })
    }

    return [
      {
        source: '/(.*)',
        headers: baseHeaders,
      },
    ]
  },
}

export default withNextIntl(withSentryConfig(bundleAnalyzer(nextConfig), {
  silent: true,
  widenClientFileUpload: true,
}))

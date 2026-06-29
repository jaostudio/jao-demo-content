import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://jao-demo-security-jamesonolitoquits-projects.vercel.app'),
  title: { default: 'IslaVault — Secure client portals for distributed organizations', template: '%s | IslaVault' },
  description: 'IslaVault is a fictional Philippine-inspired security platform demonstrating tenant isolation, role-based access control, immutable audit trails, and Turso-backed database security.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon-57x57.png', sizes: '57x57' },
      { url: '/apple-touch-icon-60x60.png', sizes: '60x60' },
      { url: '/apple-touch-icon-72x72.png', sizes: '72x72' },
      { url: '/apple-touch-icon-76x76.png', sizes: '76x76' },
      { url: '/apple-touch-icon-114x114.png', sizes: '114x114' },
      { url: '/apple-touch-icon-120x120.png', sizes: '120x120' },
      { url: '/apple-touch-icon-144x144.png', sizes: '144x144' },
      { url: '/apple-touch-icon-152x152.png', sizes: '152x152' },
      { url: '/apple-touch-icon-180x180.png', sizes: '180x180' },
      { url: '/apple-touch-icon-256x256.png', sizes: '256x256' },
    ],
  },
  openGraph: {
    title: 'IslaVault — Secure client portals for distributed organizations',
    description: 'IslaVault is a fictional Philippine-inspired security platform demonstrating tenant isolation, role-based access control, immutable audit trails, and Turso-backed database security.',
    url: 'https://jao-demo-security-jamesonolitoquits-projects.vercel.app',
    siteName: 'IslaVault',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IslaVault — Secure client portals',
    description: 'IslaVault: Tenancy, RBAC, audit trails & Turso-backed database security demo.',
    images: ['/opengraph-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className={`${inter.className} min-h-screen bg-isla-obsidian text-isla-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

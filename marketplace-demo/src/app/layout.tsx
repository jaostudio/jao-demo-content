import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth-provider'
import { Nav } from '@/components/nav'
import { PageViewTracker } from '@/components/page-view-tracker'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Marketplace Demo — Multi-Vendor Platform',
  description:
    'A two-sided marketplace demo: vendor onboarding, listings, search, reviews, and admin moderation.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100`}>
        <AuthProvider>
          <Nav />
          <PageViewTracker />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

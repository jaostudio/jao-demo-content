import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/nav'
import { PageViewTracker } from '@/components/page-view-tracker'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Commerce Demo — Full E-commerce System',
  description:
    'A complete e-commerce lifecycle demo: product catalog, cart, checkout, payments, and order management.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100`}>
        <Nav />
        <PageViewTracker />
        {children}
      </body>
    </html>
  )
}

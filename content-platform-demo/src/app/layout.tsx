import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/provider'
import { Toaster } from '@/components/ui/toaster'
import { DemoRoleSwitcher } from '@/components/demo-role-switcher'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Likha — Follow the work before it becomes finished',
    template: '%s | Likha',
  },
  description: 'A process-first social publishing platform for artists. Publish live works, process notes, collections, and studio dispatches in one creative network.',
  icons: {
    icon: '/favicon.svg',
    apple: [{ url: '/apple-icon.png' }],
  },
  openGraph: {
    title: 'Likha — Follow the work before it becomes finished',
    description: 'A process-first social publishing platform for artists. Publish live works, process notes, collections, and studio dispatches in one creative network.',
    type: 'website',
    siteName: 'Likha',
    images: [{ url: '/og/likha-og.svg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Likha — Follow the work before it becomes finished',
    description: 'A process-first social publishing platform for artists. Publish live works, process notes, collections, and studio dispatches in one creative network.',
    images: [{ url: '/og/likha-og.svg' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-surface text-text-body antialiased`}>
        <Providers>
          {children}
          <DemoRoleSwitcher />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

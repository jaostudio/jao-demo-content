import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'Security Portal — Secure B2B Portal', template: '%s | Security Portal' },
  description: 'A secure B2B client portal with audit trails, RBAC, data isolation, and security headers.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white text-neutral-900 antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

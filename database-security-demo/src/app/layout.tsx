import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'IslaVault — Secure client portals for distributed organizations', template: '%s | IslaVault' },
  description: 'IslaVault is a fictional Philippine-inspired security platform demonstrating tenant isolation, role-based access control, immutable audit trails, and Turso-backed database security.',
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

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/provider'
import { Toaster } from '@/components/ui/toaster'
import { DemoRoleSwitcher } from '@/components/demo-role-switcher'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Likha — Philippine Community Information Hub',
    template: '%s | Likha',
  },
  description: 'A community-driven information platform for the Philippines: editorial workflows, bilingual content, and community engagement.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Likha — Philippine Community Information Hub',
    description: 'Opinyon, kwento, at impormasyon para sa bawat Pilipino.',
    type: 'website',
    siteName: 'Likha',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Likha — Philippine Community Information Hub',
    description: 'Opinyon, kwento, at impormasyon para sa bawat Pilipino.',
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

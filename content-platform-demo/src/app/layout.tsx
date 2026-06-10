import type { Metadata } from 'next'
import { Fraunces, Manrope, JetBrains_Mono } from 'next/font/google'
import { Providers } from '@/components/provider'
import { BottomNav } from '@/components/bottom-nav'
import { DemoRoleSwitcher } from '@/components/demo-role-switcher'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Likha — kwento ng bayan',
    template: '%s | Likha',
  },
  description: 'The Philippine Community Information Hub — opinyon, kwento, at impormasyon para sa bawat Pilipino.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Likha — kwento ng bayan',
    description: 'Opinyon, kwento, at impormasyon para sa bawat Pilipino.',
    type: 'website',
    siteName: 'Likha',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Likha — kwento ng bayan',
    description: 'Opinyon, kwento, at impormasyon para sa bawat Pilipino.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${manrope.variable} ${jetbrainsMono.variable} min-h-screen bg-cream text-neutral-800 antialiased dark:bg-[#1A1A1A] dark:text-neutral-200`}>
        <Providers>
          <div className="pb-16 md:pb-0">
            {children}
          </div>
          <BottomNav />
          <DemoRoleSwitcher />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

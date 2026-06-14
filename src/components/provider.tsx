'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { LocaleProvider } from '@/i18n/locale-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}

'use client'

import { ThemeProvider } from 'next-themes'
import { LocaleProvider } from '@/i18n/locale-provider'
import { AuthProvider } from '@/hooks/useAuth'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

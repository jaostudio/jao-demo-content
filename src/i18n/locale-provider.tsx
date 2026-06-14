'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import enMessages from './messages/en.json'

type Locale = 'en' | 'tl'

interface LocaleContextType {
  locale: Locale
  setLocale: (l: Locale) => void
}

const LocaleContext = createContext<LocaleContextType>({ locale: 'en', setLocale: () => {} })

export function useLocale() {
  return useContext(LocaleContext)
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [messages, setMessages] = useState<Record<string, unknown>>(enMessages)

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('likha-locale', l)
    import(`./messages/${l}.json`).then((mod) => {
      setMessages(mod.default)
    })
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('likha-locale') as Locale | null
    if (saved && saved !== 'en') {
      setLocaleState(saved)
      import(`./messages/${saved}.json`).then((mod) => {
        setMessages(mod.default)
      })
    }
  }, [])

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Manila">
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  )
}

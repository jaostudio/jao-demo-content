'use client'

import { useLocale } from '@/i18n/locale-provider'
import { Languages } from 'lucide-react'

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale()

  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'tl' : 'en')}
      className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/10"
      aria-label="Switch language"
    >
      <Languages className="h-4 w-4" />
      {locale === 'en' ? 'TL' : 'EN'}
    </button>
  )
}

'use client'

import { useLocale } from '@/i18n/locale-provider'

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale()

  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'tl' : 'en')}
      className="rounded-full px-2 py-1 text-xs font-medium text-text-muted transition-colors hover:bg-slate-100 hover:text-text-secondary dark:hover:bg-slate-700"
      aria-label="Switch language"
    >
      {locale === 'en' ? 'TL' : 'EN'}
    </button>
  )
}

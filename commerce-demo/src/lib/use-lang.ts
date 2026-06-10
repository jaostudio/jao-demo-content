'use client'

import { useEffect, useState } from 'react'
import type { Lang } from './lang'

export function useLang(): Lang {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const readLang = () => {
      const stored = document.cookie.replace(/(?:(?:^|.*;\s*)lang\s*=\s*([^;]*).*$)|^.*$/, '$1')
      setLang(stored === 'tl' ? 'tl' : 'en')
    }
    readLang()
    window.addEventListener('langchange', readLang)
    return () => window.removeEventListener('langchange', readLang)
  }, [])

  return lang
}

export function setLangCookie(lang: Lang) {
  document.cookie = `lang=${lang};path=/;max-age=${60 * 60 * 24 * 365}`
  window.dispatchEvent(new CustomEvent('langchange'))
}
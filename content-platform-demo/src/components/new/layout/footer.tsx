'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Rss } from 'lucide-react'

export function Footer() {
  const t = useTranslations('common')

  function handleReset() {
    if (typeof window !== 'undefined') {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <footer className="mt-12 border-t border-border">
      <div className="container-likha flex flex-col items-center justify-between gap-2 py-6 text-xs text-text-muted md:flex-row">
        <div className="flex items-center gap-3">
          <span className="font-display text-sm font-bold text-text-primary">
            Likha
          </span>
          <span className="hidden md:inline">&middot;</span>
          <span className="hidden md:inline">{t('footer_tagline')}</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-text-primary transition-colors">{t('home')}</Link>
          <Link href="/rss.xml" className="flex items-center gap-1 hover:text-text-primary transition-colors">
            <Rss className="h-3 w-3" /> RSS
          </Link>
          <button onClick={handleReset} className="hover:text-text-primary transition-colors cursor-pointer">
            Reset demo
          </button>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  )
}

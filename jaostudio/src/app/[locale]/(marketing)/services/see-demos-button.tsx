'use client'

import { useCallback } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { track } from '@/lib/analytics'
import { EVENTS } from '@/lib/analytics/events'

export function SeeDemosButton({ label }: { label: string }) {
  const locale = useLocale()

  const handleClick = useCallback(() => {
    track(EVENTS.DEMO_CLICK, { locale })
  }, [locale])

  return (
    <Link
      href="/demos"
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-xl bg-text-primary px-6 py-3 text-sm font-medium text-bg-primary transition-[opacity,transform] hover:opacity-90 active:scale-[0.99]"
    >
      {label}
    </Link>
  )
}

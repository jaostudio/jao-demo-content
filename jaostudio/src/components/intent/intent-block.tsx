'use client'

import { useTranslations } from 'next-intl'

export function IntentBlock({ k, className }: { k: string; className?: string }) {
  const t = useTranslations('intent')
  return <p className={className}>{t(k)}</p>
}

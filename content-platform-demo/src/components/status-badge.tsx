'use client'

import { useTranslations } from 'next-intl'

const styles: Record<string, string> = {
  DRAFT: 'border-neutral-400 text-neutral-600 dark:text-neutral-300',
  PENDING_REVIEW: 'border-saffron-500 text-saffron-700 dark:text-saffron-400',
  PUBLISHED: 'border-cat-tech text-cat-tech',
  ARCHIVED: 'border-neutral-300 text-neutral-400',
}

export function StatusBadge({ status }: { status: string }) {
  const t = useTranslations('status')
  const key = status.toLowerCase() as 'draft' | 'pending_review' | 'published' | 'archived'
  return (
    <span className={`stamp text-[10px] ${styles[status] ?? 'border-neutral-400 text-neutral-600'}`}>
      {t(key) || status.replace(/_/g, ' ')}
    </span>
  )
}

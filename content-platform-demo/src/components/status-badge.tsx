'use client'

import { useTranslations } from 'next-intl'

const styles: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  PENDING_REVIEW: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  PUBLISHED: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  ARCHIVED: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
}

export function StatusBadge({ status }: { status: string }) {
  const t = useTranslations('status')
  const key = status.toLowerCase() as 'draft' | 'pending_review' | 'published' | 'archived'
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${styles[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {t(key) || status.replace(/_/g, ' ')}
    </span>
  )
}

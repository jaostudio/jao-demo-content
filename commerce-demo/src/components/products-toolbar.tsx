'use client'

import { useCallback } from 'react'
import { t } from '@/lib/lang-utils'
import type { Lang } from '@/lib/lang'

function buildUrl(current: string, overrides: Record<string, string | undefined>) {
  const params = new URLSearchParams(current)
  Object.entries(overrides).forEach(([k, v]) => {
    if (v) params.set(k, v)
    else params.delete(k)
  })
  const s = params.toString()
  return s ? `/products?${s}` : '/products'
}

export function SortSelect({
  lang,
  sort,
  searchParams,
}: {
  lang: Lang
  sort: string | undefined
  searchParams: string
}) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      window.location.href = buildUrl(searchParams, { sort: e.target.value || undefined, page: '1' })
    },
    [searchParams],
  )

  return (
    <select
      defaultValue={sort ?? ''}
      onChange={handleChange}
      className="rounded-lg border border-subtle bg-white px-3 py-1.5 text-sm dark:bg-surface"
      aria-label={t(lang, 'products.sort')}
    >
      <option value="">{t(lang, 'products.sort.newest')}</option>
      <option value="price_asc">{t(lang, 'products.sort.priceAsc')}</option>
      <option value="price_desc">{t(lang, 'products.sort.priceDesc')}</option>
    </select>
  )
}

export function LowStockCheckbox({
  lang,
  lowStock,
  searchParams,
}: {
  lang: Lang
  lowStock: string | undefined
  searchParams: string
}) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      window.location.href = buildUrl(searchParams, { lowStock: e.target.checked ? 'true' : undefined, page: '1' })
    },
    [searchParams],
  )

  return (
    <label className="flex items-center gap-1.5 text-sm text-muted">
      <input
        type="checkbox"
        defaultChecked={lowStock === 'true'}
        onChange={handleChange}
        className="accent-flag-blue"
      />
      {t(lang, 'products.lowStockOnly')}
    </label>
  )
}

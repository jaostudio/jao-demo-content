import { fetchAPI } from '@/lib/api/server'
import type { CategoryResponse } from '@content-platform/shared'
import { AppShell } from '@/components/new/layout/app-shell'
import { EmptyState } from '@/components/new/ui/empty-state'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse all categories on Likha.',
}

export default async function CategoryIndexPage() {
  let categories: CategoryResponse[] = []
  let error = false
  try {
    categories = await fetchAPI<CategoryResponse[]>('/api/categories')
  } catch {
    error = true
  }

  if (error && categories.length === 0) {
    return (
      <AppShell>
        <EmptyState
          title="Could not load categories"
          description="Something went wrong. Try again."
          action={<a href="/category" className="btn btn-accent btn-sm">Retry</a>}
        />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <h1 className="text-[17px] font-semibold text-text-primary mb-4">Categories</h1>
      {categories.length === 0 ? (
        <EmptyState title="No categories yet" />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="kard rounded-xl p-4 transition-colors hover:bg-surface-alt"
            >
              <h2 className="text-[14px] font-semibold text-text-primary">{cat.name}</h2>
              <p className="text-[12px] text-fog-gray mt-1">
                {cat._count?.articles ?? 0} work{(cat._count?.articles ?? 0) !== 1 ? 's' : ''}
              </p>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  )
}

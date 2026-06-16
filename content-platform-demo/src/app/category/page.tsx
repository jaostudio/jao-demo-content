import { fetchAPI } from '@/lib/api/server'
import type { CategoryResponse } from '@content-platform/shared'
import { NEW_LAYOUT_ENABLED } from '@/lib/new/flags'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse all categories on Likha.',
}

export default async function CategoryIndexPage() {
  let categories: CategoryResponse[] = []
  try {
    categories = await fetchAPI<CategoryResponse[]>('/api/categories')
  } catch {
    // backend unavailable during build
  }

  if (NEW_LAYOUT_ENABLED) {
    return (
      <div className="min-h-screen bg-surface dark:bg-surface-dark">
        <div className="hidden lg:block">
          {/* LeftRail is rendered in layout.tsx for new layout — skip here */}
        </div>
        <div className="lg:ml-[68px]">
          <Header />
          <main className="container-likha py-4">
            <h1 className="text-[17px] font-semibold text-text-primary mb-4">Categories</h1>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="kard rounded-xl p-4 transition-colors hover:bg-surface-alt dark:hover:bg-surface-dark"
                >
                  <h2 className="text-[14px] font-semibold text-text-primary">{cat.name}</h2>
                  <p className="text-[12px] text-fog-gray mt-1">
                    {cat._count?.articles ?? 0} article{(cat._count?.articles ?? 0) !== 1 ? 's' : ''}
                  </p>
                </Link>
              ))}
            </div>
            {categories.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-[14px] text-fog-gray">Wala pang kategorya.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-4">
        <h1 className="text-xl font-semibold text-text-primary dark:text-slate-100 mb-4">Categories</h1>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-surface-alt dark:border-border-dark dark:bg-card-dark dark:hover:bg-surface-dark"
            >
              <h2 className="text-sm font-semibold text-text-primary dark:text-slate-100">{cat.name}</h2>
              <p className="text-xs text-text-muted mt-1">
                {cat._count?.articles ?? 0} article{(cat._count?.articles ?? 0) !== 1 ? 's' : ''}
              </p>
            </Link>
          ))}
        </div>
        {categories.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-text-muted">Wala pang kategorya.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

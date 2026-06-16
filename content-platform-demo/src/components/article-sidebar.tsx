import Link from 'next/link'
import { fetchAPI } from '@/lib/api/server'
import type { ArticleSummary } from '@content-platform/shared'
import { CategoryBadge } from '@/components/category-badge'
import { StatusBadge } from '@/components/status-badge'

interface ArticleSidebarProps {
  currentSlug: string
  authorName: string
  categorySlug: string
  categoryName: string
  status: string
  readingTime: number
  publishAt: Date | string | null
}

const avatarColors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-rose-500', 'bg-violet-500']

function getAvatarColor(name: string) {
  const index = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return avatarColors[index % avatarColors.length]
}

export async function ArticleSidebar({ currentSlug, authorName, categorySlug, categoryName, status, readingTime, publishAt }: ArticleSidebarProps) {
  let related: { title: string; slug: string }[] = []
  try {
    const articles = await fetchAPI<ArticleSummary[]>('/api/articles')
    related = articles
      .filter((a) => a.slug !== currentSlug)
      .slice(0, 3)
      .map((a) => ({ title: a.title, slug: a.slug }))
  } catch {
    // fallback
  }

  return (
    <aside className="space-y-3">
      {/* Author */}
      <div className="rounded-lg border border-border bg-card p-3 dark:border-border-dark dark:bg-card-dark">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${getAvatarColor(authorName)}`}>
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary dark:text-slate-100">{authorName}</p>
            <p className="text-[11px] text-text-muted">Author</p>
          </div>
        </div>
      </div>

      {/* Article Info */}
      <div className="rounded-lg border border-border bg-card p-3 dark:border-border-dark dark:bg-card-dark">
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-text-muted">Reading time</span>
            <span className="font-medium text-text-primary dark:text-slate-100">{readingTime} min</span>
          </div>
          {publishAt && (
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Published</span>
              <span className="font-medium text-text-primary dark:text-slate-100">{new Date(publishAt).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-text-muted">Category</span>
            <CategoryBadge slug={categorySlug} name={categoryName} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-muted">Status</span>
            <StatusBadge status={status} />
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-3 dark:border-border-dark dark:bg-card-dark">
          <h3 className="mb-2 text-xs font-bold text-text-primary dark:text-slate-100">Related</h3>
          <div className="space-y-2">
            {related.map((r) => (
              <Link key={r.slug} href={`/articles/${r.slug}`} className="block text-xs font-medium text-text-secondary transition-colors hover:text-primary line-clamp-2">{r.title}</Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}

import { getCurrentAuthor } from '@/lib/auth/getSession'
import { fetchAPI } from '@/lib/api/server'
import type { ArticleSummary, AdminStatsResponse } from '@content-platform/shared'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { NEW_LAYOUT_ENABLED } from '@/lib/new/flags'
import { AdminOverview } from '@/components/new/pages/admin/dashboard'
import { StatusBadge } from '@/components/status-badge'
import { TransitionButtons } from '@/components/transition-buttons'
import { IllustratedEmptyState } from '@/components/illustrated-empty-state'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const author = await getCurrentAuthor()
  if (!author) redirect('/signin?next=/admin')
  if (author.role !== 'ADMIN') redirect('/studio')

  const cookieStore = await cookies()
  const token = cookieStore.get('likha-token')?.value
  const authHeaders: Record<string, string> = {}
  if (token) authHeaders['Authorization'] = `Bearer ${token}`

  let articles: ArticleSummary[] = []
  let stats: AdminStatsResponse | null = null
  let fetchError: string | null = null

  try {
    articles = await fetchAPI<ArticleSummary[]>('/api/admin/articles', { headers: authHeaders })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[admin] GET /api/admin/articles failed', message)
    fetchError = 'articles'
  }

  try {
    stats = await fetchAPI<AdminStatsResponse>('/api/admin/stats', { headers: authHeaders })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[admin] GET /api/admin/stats failed', message)
    fetchError = fetchError ? 'multiple' : 'stats'
  }

  if (NEW_LAYOUT_ENABLED) {
    return (
      <AdminOverview
        draftCount={stats?.draftArticles ?? 0}
        pendingCount={stats?.pendingReview ?? 0}
        publishedCount={stats?.publishedArticles ?? 0}
        articles={articles.map((a) => ({
          id: a.id,
          title: a.title,
          status: a.status,
          format: a.format,
          aiFreeDeclaration: a.aiFreeDeclaration,
          authorName: a.authorName,
          createdAt: a.createdAt,
          category: { slug: a.categoryId, name: a.categoryName },
        }))}
        fetchError={fetchError}
      />
    )
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-text-primary dark:text-slate-100">Dashboard</h1>
        <p className="text-xs text-text-muted">
          {author.role === 'ADMIN' ? 'Administrator' : 'Author'} — {author.name}
        </p>
      </div>

      {fetchError && (
        <div className="mb-4 rounded-lg border border-warning bg-warning-light p-3 text-xs text-warning">
          Could not load admin data. Some dashboard information may be unavailable.
        </div>
      )}

      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-border bg-card p-3 dark:border-border-dark dark:bg-card-dark">
          <p className="text-xl font-semibold text-text-primary dark:text-slate-100">{stats?.draftArticles ?? 0}</p>
          <p className="text-[11px] text-text-muted">Drafts</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-xl font-semibold text-amber-700 dark:text-amber-400">{stats?.pendingReview ?? 0}</p>
          <p className="text-[11px] text-amber-600 dark:text-amber-500">Pending</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20">
          <p className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">{stats?.publishedArticles ?? 0}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-500">Published</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card dark:border-border-dark dark:bg-card-dark">
        <div className="border-b border-border px-4 py-2.5 dark:border-border-dark">
          <h2 className="text-sm font-semibold text-text-primary dark:text-slate-100">Articles</h2>
        </div>
        <div className="divide-y divide-border dark:divide-border-dark">
          {articles.length === 0 && (
            <IllustratedEmptyState message="No articles yet." submessage="Gumawa ng bago!" />
          )}
          {articles.map((article) => (
            <div key={article.id} className="flex items-center justify-between px-4 py-2.5">
              <div className="min-w-0 flex-1">
                <Link href={`/studio/work/${article.id}/edit`} className="text-sm font-medium text-text-primary hover:text-primary dark:text-slate-100">
                  {article.title}
                </Link>
                <p className="text-[11px] text-text-muted">
                  {article.authorName} · {article.categoryName} · {new Date(article.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={article.status} />
                {author.role === 'ADMIN' && article.status !== 'PUBLISHED' && article.status !== 'ARCHIVED' && (
                  <TransitionButtons articleId={article.id} status={article.status} />
                )}
                {author.role === 'ADMIN' && article.status === 'PUBLISHED' && (
                  <TransitionButtons articleId={article.id} status={article.status} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

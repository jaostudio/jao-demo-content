import { getCurrentAuthor } from '@/lib/auth/getSession'
import { fetchAPI } from '@/lib/api/server'
import type { AdminStatsResponse } from '@content-platform/shared'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { ChartSection } from '@/components/chart-section'

export const dynamic = 'force-dynamic'

const COLORS = {
  draft: '#94A3B8',
  pending: '#F59E0B',
  published: '#22C55E',
  archived: '#64748B',
}

export default async function AnalyticsPage() {
  const author = await getCurrentAuthor()
  if (!author) redirect('/signin')
  if (author.role !== 'ADMIN') redirect('/admin')

  const cookieStore = await cookies()
  const token = cookieStore.get('likha-token')?.value
  const authHeaders: Record<string, string> = {}
  if (token) authHeaders['Authorization'] = `Bearer ${token}`

  let stats: AdminStatsResponse | null = null
  let fetchError: string | null = null

  try {
    stats = await fetchAPI<AdminStatsResponse>('/api/admin/stats', { headers: authHeaders })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[admin/analytics] GET /api/admin/stats failed', message)
    fetchError = message
  }

  const safeStats = stats ?? {
    totalArticles: 0,
    draftArticles: 0,
    pendingReview: 0,
    publishedArticles: 0,
    archivedArticles: 0,
    totalAuthors: 0,
    totalCategories: 0,
    totalTags: 0,
    totalComments: 0,
    categories: [],
  }

  const statusData = [
    { name: 'Draft', value: safeStats.draftArticles, color: COLORS.draft },
    { name: 'Pending', value: safeStats.pendingReview, color: COLORS.pending },
    { name: 'Published', value: safeStats.publishedArticles, color: COLORS.published },
    { name: 'Archived', value: safeStats.archivedArticles, color: COLORS.archived },
  ]

  const categoryChartData = (safeStats.categories ?? []).map((cat: { name: string; _count?: { articles: number } }) => ({
    name: cat.name,
    articles: cat._count?.articles ?? 0,
  }))

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-text-primary dark:text-slate-100">Analytics</h1>

      {fetchError && (
        <div className="mb-4 rounded-lg border border-warning bg-warning-light p-3 text-xs text-warning">
          Could not load analytics data. Some charts may be unavailable.
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="Total Articles" value={safeStats.totalArticles} />
        <MetricCard label="Drafts" value={safeStats.draftArticles} />
        <MetricCard label="Published" value={safeStats.publishedArticles} />
        <MetricCard label="Authors" value={safeStats.totalAuthors} />
        <MetricCard label="Categories" value={safeStats.totalCategories} />
        <MetricCard label="Tags" value={safeStats.totalTags} />
        <MetricCard label="Comments" value={safeStats.totalComments} />
        <MetricCard label="Archived" value={safeStats.archivedArticles} />
      </div>

      {categoryChartData.length > 0 && (
        <ChartSection categoryData={categoryChartData} statusData={statusData.filter((d) => d.value > 0)} />
      )}
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 dark:border-border-dark dark:bg-card-dark">
      <p className="text-xl font-semibold text-text-primary dark:text-slate-100">{value}</p>
      <p className="text-[11px] text-text-muted">{label}</p>
    </div>
  )
}

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

  const stats = await fetchAPI<AdminStatsResponse>('/api/admin/stats', { headers: authHeaders })

  const statusData = [
    { name: 'Draft', value: stats.draftArticles, color: COLORS.draft },
    { name: 'Pending', value: stats.pendingReview, color: COLORS.pending },
    { name: 'Published', value: stats.publishedArticles, color: COLORS.published },
    { name: 'Archived', value: stats.archivedArticles, color: COLORS.archived },
  ]

  const categoryChartData = (stats.categories ?? []).map((cat) => ({
    name: cat.name,
    articles: cat._count?.articles ?? 0,
  }))

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-text-primary dark:text-slate-100">Analytics</h1>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="Total Articles" value={stats.totalArticles} />
        <MetricCard label="Drafts" value={stats.draftArticles} />
        <MetricCard label="Published" value={stats.publishedArticles} />
        <MetricCard label="Authors" value={stats.totalAuthors} />
        <MetricCard label="Categories" value={stats.totalCategories} />
        <MetricCard label="Tags" value={stats.totalTags} />
        <MetricCard label="Comments" value={stats.totalComments} />
        <MetricCard label="Archived" value={stats.archivedArticles} />
      </div>

      <ChartSection categoryData={categoryChartData} statusData={statusData.filter((d) => d.value > 0)} />
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

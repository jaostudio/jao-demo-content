import { getCurrentAuthor } from '@/lib/auth/getSession'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
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

  const [
    totalArticles,
    draftsCount,
    pendingCount,
    publishedCount,
    archivedCount,
    totalAuthors,
    totalCategories,
    totalTags,
    totalComments,
    categoryBreakdown,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: 'DRAFT' } }),
    prisma.article.count({ where: { status: 'PENDING_REVIEW' } }),
    prisma.article.count({ where: { status: 'PUBLISHED' } }),
    prisma.article.count({ where: { status: 'ARCHIVED' } }),
    prisma.author.count(),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.comment.count(),
    prisma.category.findMany({
      include: { _count: { select: { articles: true } } },
    }),
  ])

  const statusData = [
    { name: 'Draft', value: draftsCount, color: COLORS.draft },
    { name: 'Pending', value: pendingCount, color: COLORS.pending },
    { name: 'Published', value: publishedCount, color: COLORS.published },
    { name: 'Archived', value: archivedCount, color: COLORS.archived },
  ]

  const categoryChartData = categoryBreakdown.map((cat) => ({
    name: cat.name,
    articles: cat._count.articles,
  }))

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-text-primary dark:text-slate-100">Analytics</h1>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="Total Articles" value={totalArticles} />
        <MetricCard label="Drafts" value={draftsCount} />
        <MetricCard label="Published" value={publishedCount} />
        <MetricCard label="Authors" value={totalAuthors} />
        <MetricCard label="Categories" value={totalCategories} />
        <MetricCard label="Tags" value={totalTags} />
        <MetricCard label="Comments" value={totalComments} />
        <MetricCard label="Archived" value={archivedCount} />
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

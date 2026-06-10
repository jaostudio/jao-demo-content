import { getCurrentAuthor } from '@/lib/auth/getSession'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ChartSection } from '@/components/chart-section'

export const dynamic = 'force-dynamic'

const COLORS = {
  draft: '#94a3b8',
  pending: '#F79F1F',
  published: '#0D9488',
  archived: '#64748b',
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
      <h1 className="mb-6 font-display text-2xl font-bold text-black dark:text-white">Analytics</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Total Articles" value={totalArticles} />
        <MetricCard label="Drafts" value={draftsCount} />
        <MetricCard label="Pending Review" value={pendingCount} />
        <MetricCard label="Published" value={publishedCount} />
        <MetricCard label="Archived" value={archivedCount} />
        <MetricCard label="Authors" value={totalAuthors} />
        <MetricCard label="Categories" value={totalCategories} />
        <MetricCard label="Tags" value={totalTags} />
      </div>

      <ChartSection categoryData={categoryChartData} statusData={statusData.filter((d) => d.value > 0)} />

      <div className="mb-8 border-2 border-black bg-cream p-6 nb-shadow dark:border-white dark:bg-black">
        <h2 className="mb-2 font-display text-sm font-bold text-black dark:text-white">Community</h2>
        <p className="text-sm text-neutral-500">{totalComments} comments across all articles</p>
      </div>

      <div className="border-2 border-black bg-white nb-shadow dark:border-white dark:bg-black">
        <div className="border-b-2 border-black px-6 py-4 dark:border-white">
          <h2 className="font-display text-sm font-bold text-black dark:text-white">Articles per Category (Detailed)</h2>
        </div>
        <div className="divide-y-2 divide-black dark:divide-white">
          {categoryBreakdown.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between px-6 py-3">
              <span className="text-sm font-bold text-black dark:text-white">{cat.name}</span>
              <span className="text-sm text-neutral-500">{cat._count.articles} articles</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-2 border-black bg-cream p-4 nb-shadow dark:border-white dark:bg-black">
      <p className="font-display text-2xl font-bold text-black dark:text-white">{value}</p>
      <p className="text-sm text-neutral-500">{label}</p>
    </div>
  )
}

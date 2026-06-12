import { getCurrentAuthor } from '@/lib/auth/getSession'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { NEW_LAYOUT_ENABLED } from '@/lib/new/flags'
import { AdminDashboard } from '@/components/new/pages/admin/dashboard'
import { StatusBadge } from '@/components/status-badge'
import { TransitionButtons } from '@/components/transition-buttons'
import { IllustratedEmptyState } from '@/components/illustrated-empty-state'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const author = await getCurrentAuthor()
  if (!author) redirect('/signin')

  const [articles, draftCount, pendingCount, publishedCount] = await Promise.all([
    prisma.article.findMany({
      include: { author: true, category: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.article.count({ where: { status: 'DRAFT' } }),
    prisma.article.count({ where: { status: 'PENDING_REVIEW' } }),
    prisma.article.count({ where: { status: 'PUBLISHED' } }),
  ])

  const myArticles = author.role === 'ADMIN'
    ? articles
    : articles.filter((a) => a.authorId === author.id)

  if (NEW_LAYOUT_ENABLED) {
    return (
      <AdminDashboard
        draftCount={draftCount}
        pendingCount={pendingCount}
        publishedCount={publishedCount}
        articles={myArticles.map((a) => ({
          id: a.id,
          title: a.title,
          status: a.status,
          authorName: a.author.name,
          createdAt: a.createdAt,
          category: { slug: a.category.slug, name: a.category.name },
        }))}
      />
    )
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-bold text-text-primary dark:text-slate-100">Dashboard</h1>
        <p className="text-xs text-text-muted">
          {author.role === 'ADMIN' ? 'Administrator' : 'Author'} — {author.name}
        </p>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-border bg-card p-3 dark:border-border-dark dark:bg-card-dark">
          <p className="text-xl font-bold text-text-primary dark:text-slate-100">{draftCount}</p>
          <p className="text-[11px] text-text-muted">Drafts</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-xl font-bold text-amber-700 dark:text-amber-400">{pendingCount}</p>
          <p className="text-[11px] text-amber-600 dark:text-amber-500">Pending</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20">
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{publishedCount}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-500">Published</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card dark:border-border-dark dark:bg-card-dark">
        <div className="border-b border-border px-4 py-2.5 dark:border-border-dark">
          <h2 className="text-sm font-bold text-text-primary dark:text-slate-100">Articles</h2>
        </div>
        <div className="divide-y divide-border dark:divide-border-dark">
          {myArticles.length === 0 && (
            <IllustratedEmptyState message="No articles yet." submessage="Gumawa ng bago!" />
          )}
          {myArticles.map((article) => (
            <div key={article.id} className="flex items-center justify-between px-4 py-2.5">
              <div className="min-w-0 flex-1">
                <Link href={`/admin/articles/${article.id}/edit`} className="text-sm font-medium text-text-primary hover:text-primary dark:text-slate-100">
                  {article.title}
                </Link>
                <p className="text-[11px] text-text-muted">
                  {article.author.name} · {article.category.name} · {new Date(article.updatedAt).toLocaleDateString()}
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

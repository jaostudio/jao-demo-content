import { getCurrentAuthor } from '@/lib/auth/getSession'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { StatusBadge } from '@/components/status-badge'
import { TransitionButtons } from '@/components/transition-buttons'
import { IllustratedEmptyState } from '@/components/illustrated-empty-state'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-black dark:text-white">Dashboard</h1>
        <p className="text-sm text-neutral-500">
          {author.role === 'ADMIN' ? 'Administrator' : 'Author'} — {author.name}
        </p>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="border-2 border-black bg-cream p-4 nb-shadow dark:border-white dark:bg-black">
          <p className="font-display text-2xl font-bold text-black dark:text-white">{draftCount}</p>
          <p className="text-sm text-neutral-500">Drafts</p>
        </div>
        <div className="border-2 border-black bg-saffron-100 p-4 nb-shadow dark:border-white dark:bg-saffron-900/30">
          <p className="font-display text-2xl font-bold text-black dark:text-white">{pendingCount}</p>
          <p className="text-sm text-neutral-500">Pending Review</p>
        </div>
        <div className="border-2 border-black bg-cream p-4 nb-shadow dark:border-white dark:bg-black">
          <p className="font-display text-2xl font-bold text-black dark:text-white">{publishedCount}</p>
          <p className="text-sm text-neutral-500">Published</p>
        </div>
      </div>

      <div className="border-2 border-black bg-white nb-shadow dark:border-white dark:bg-black">
        <div className="border-b-2 border-black px-4 py-3 dark:border-white">
          <h2 className="font-display font-bold">Articles</h2>
        </div>
        <div className="divide-y-2 divide-black dark:divide-white">
          {myArticles.length === 0 && (
            <IllustratedEmptyState message="No articles yet." submessage="Gumawa ng bago!" />
          )}
          {myArticles.map((article) => (
            <div key={article.id} className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0 flex-1">
                <Link href={`/admin/articles/${article.id}/edit`} className="font-bold hover:underline">
                  {article.title}
                </Link>
                <p className="text-xs text-neutral-500">
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

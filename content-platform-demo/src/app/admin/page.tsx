import { getCurrentAuthor } from '@/lib/auth/getSession'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { StatusBadge } from '@/components/status-badge'
import { TransitionButtons } from '@/components/transition-buttons'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const author = await getCurrentAuthor()
  if (!author) redirect('/signin')

  const [articles, draftCount, pendingCount, publishedCount] = await Promise.all([
    (prisma as any).article.findMany({
      include: { author: true, category: true },
      orderBy: { updatedAt: 'desc' },
    }) as any[],
    (prisma as any).article.count({ where: { status: 'DRAFT' } }),
    (prisma as any).article.count({ where: { status: 'PENDING_REVIEW' } }),
    (prisma as any).article.count({ where: { status: 'PUBLISHED' } }),
  ])

  const myArticles = articles.filter((a: any) => a.authorId === author.id || author.role === 'ADMIN')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500">
          {author.role === 'ADMIN' ? 'Administrator' : 'Author'} — {author.name}
        </p>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-2xl font-bold">{draftCount}</p>
          <p className="text-sm text-gray-500">Drafts</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-2xl font-bold">{pendingCount}</p>
          <p className="text-sm text-gray-500">Pending Review</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-2xl font-bold">{publishedCount}</p>
          <p className="text-sm text-gray-500">Published</p>
        </div>
      </div>

      <div className="rounded-lg border">
        <div className="border-b px-4 py-3">
          <h2 className="font-semibold">Articles</h2>
        </div>
        <div className="divide-y">
          {myArticles.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-gray-500">No articles yet.</p>
          )}
          {myArticles.map((article: any) => (
            <div key={article.id} className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0 flex-1">
                <Link href={`/admin/articles/${article.id}/edit`} className="font-medium hover:underline">
                  {article.title}
                </Link>
                <p className="text-xs text-gray-500">
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

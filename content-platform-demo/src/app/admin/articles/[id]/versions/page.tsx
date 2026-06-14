import { getCurrentAuthor } from '@/lib/auth/getSession'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ArticleVersionsPage({ params }: { params: Promise<{ id: string }> }) {
  const author = await getCurrentAuthor()
  if (!author) redirect('/signin')

  const { id } = await params
  const article = await prisma.article.findUnique({
    where: { id },
    include: { versions: { orderBy: { createdAt: 'desc' } } },
  })
  if (!article) notFound()

  if (article.authorId !== author.id && author.role !== 'ADMIN') redirect('/admin')

  return (
    <div>
      <Link href={`/admin/articles/${id}/edit`} className="text-xs font-medium text-text-muted hover:text-primary">&larr; Back to editor</Link>
      <h1 className="mb-1 mt-3 text-lg font-semibold text-text-primary dark:text-slate-100">Version History</h1>
      <p className="mb-4 text-xs text-text-muted">{article.title}</p>

      {article.versions.length === 0 && (
        <p className="py-8 text-center text-sm text-text-muted">No previous versions saved.</p>
      )}

      <div className="space-y-2">
        {article.versions.map((v, i) => (
          <div key={v.id} className="rounded-lg border border-border bg-card p-3 dark:border-border-dark dark:bg-card-dark">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-text-primary dark:text-slate-100">Version {article.versions.length - i}</span>
              <span className="text-[10px] text-text-muted">{v.createdAt.toLocaleString()}</span>
            </div>
            <details>
              <summary className="cursor-pointer text-[11px] text-text-muted hover:text-text-secondary">Preview content</summary>
              <pre className="mt-2 max-h-48 overflow-auto rounded bg-slate-50 p-2 text-[11px] dark:bg-slate-800">{v.content}</pre>
            </details>
          </div>
        ))}
      </div>
    </div>
  )
}

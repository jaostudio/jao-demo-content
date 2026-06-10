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
      <Link href={`/admin/articles/${id}/edit`} className="text-sm font-bold text-neutral-500 underline hover:text-saffron-600">&larr; Back to editor</Link>
      <h1 className="mb-1 mt-4 font-display text-2xl font-bold">Version History</h1>
      <p className="mb-6 text-sm font-bold text-neutral-500">{article.title}</p>

      {article.versions.length === 0 && (
        <p className="py-8 text-center text-sm text-neutral-500">No previous versions saved.</p>
      )}

      <div className="space-y-3">
        {article.versions.map((v, i) => (
          <div key={v.id} className="border-2 border-black p-4 nb-shadow dark:border-white">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-bold">Version {article.versions.length - i}</span>
              <span className="text-xs text-neutral-500">{v.createdAt.toLocaleString()}</span>
            </div>
            <details>
              <summary className="cursor-pointer text-xs font-bold text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">Preview content</summary>
              <pre className="mt-2 max-h-48 overflow-auto border border-black bg-saffron-100 p-3 text-xs font-mono dark:border-white dark:bg-saffron-900/20">{v.content}</pre>
            </details>
          </div>
        ))}
      </div>
    </div>
  )
}

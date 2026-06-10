import { getCurrentAuthor } from '@/lib/auth/getSession'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArticleForm } from '../../article-form'
import { updateArticle } from '@/lib/actions/articles'

export const dynamic = 'force-dynamic'

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const author = await getCurrentAuthor()
  if (!author) redirect('/signin')

  const { id: articleId } = await params
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: { tags: true },
  })
  if (!article) notFound()

  if (article.authorId !== author.id && author.role !== 'ADMIN') redirect('/admin')
  if (article.status === 'PENDING_REVIEW' && author.role !== 'ADMIN') {
    redirect('/admin?error=Cannot edit article under review')
  }

  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ orderBy: { name: 'asc' } }),
  ])

  const updateAction = updateArticle.bind(null, articleId)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Edit Article</h1>
        <Link
          href={`/admin/articles/${articleId}/versions`}
          className="text-sm font-bold text-neutral-500 underline hover:text-saffron-600"
        >
          Version History
        </Link>
      </div>
      <ArticleForm
        categories={categories}
        tags={tags}
        article={{
          id: article.id,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          categoryId: article.categoryId,
          tags: article.tags.map((t) => ({ tagId: t.tagId })),
        }}
        action={updateAction}
      />
    </div>
  )
}

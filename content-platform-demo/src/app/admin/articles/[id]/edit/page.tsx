import { getCurrentAuthor } from '@/lib/auth/getSession'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import { ArticleForm } from '../../article-form'
import { updateArticle } from '@/lib/actions/articles'

export const dynamic = 'force-dynamic'

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const author = await getCurrentAuthor()
  if (!author) redirect('/signin')

  const { id: articleId } = await params
  const article = await (prisma as any).article.findUnique({
    where: { id: articleId },
    include: { tags: true },
  })
  if (!article) notFound()
  if (article.authorId !== author.id && author.role !== 'ADMIN') redirect('/admin')

  const [categories, tags] = await Promise.all([
    (prisma as any).category.findMany({ orderBy: { name: 'asc' } }),
    (prisma as any).tag.findMany({ orderBy: { name: 'asc' } }),
  ])

  const updateAction = updateArticle.bind(null, articleId)

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit Article</h1>
      <ArticleForm
        categories={categories}
        tags={tags}
        article={{
          id: article.id,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          categoryId: article.categoryId,
          tags: article.tags.map((t: any) => ({ tagId: t.tagId })),
        }}
        action={updateAction}
      />
    </div>
  )
}

import { getCurrentAuthor } from '@/lib/auth/getSession'
import { fetchAPI } from '@/lib/api/server'
import type { ArticleSummary, CategoryResponse } from '@content-platform/shared'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { ArticleForm } from '../../article-form'
import { updateArticle } from '@/lib/actions/article-actions'

export const dynamic = 'force-dynamic'

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const author = await getCurrentAuthor()
  if (!author) redirect('/signin')

  const { id: articleId } = await params

  const cookieStore = await cookies()
  const token = cookieStore.get('likha-token')?.value
  const authHeaders: Record<string, string> = {}
  if (token) authHeaders['Authorization'] = `Bearer ${token}`

  let article: ArticleSummary
  try {
    article = await fetchAPI<ArticleSummary>(`/api/admin/articles`, { headers: authHeaders })
      .then((articles) => {
        const found = (articles as unknown as ArticleSummary[]).find((a) => a.id === articleId)
        if (!found) throw new Error('not found')
        return found
      })
  } catch {
    notFound()
  }

  if (article.authorId !== author.id && author.role !== 'ADMIN') redirect('/admin')
  if (article.status === 'PENDING_REVIEW' && author.role !== 'ADMIN') {
    redirect('/admin?error=Cannot edit work under review')
  }

  const [categories, tags] = await Promise.all([
    fetchAPI<CategoryResponse[]>('/api/categories'),
    fetchAPI<{ id: string; name: string }[]>('/api/tags').catch(() => []),
  ])

  const updateAction = updateArticle.bind(null, articleId)

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-text-primary">Edit Work</h1>
        <Link
          href={`/admin/articles/${articleId}/versions`}
          className="text-xs font-medium text-text-muted hover:text-text-primary"
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
          format: article.format,
          imageUrl: article.image,
          tags: [],
        }}
        action={updateAction}
      />
    </div>
  )
}

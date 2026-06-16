import { getCurrentAuthor } from '@/lib/auth/getSession'
import { fetchAPI } from '@/lib/api/server'
import type { CategoryResponse } from '@content-platform/shared'
import { redirect } from 'next/navigation'
import { ArticleForm } from '../article-form'
import { createArticle } from '@/lib/actions/article-actions'

export const dynamic = 'force-dynamic'

export default async function NewArticlePage() {
  const author = await getCurrentAuthor()
  if (!author) redirect('/signin')

  const [categories, tags] = await Promise.all([
    fetchAPI<CategoryResponse[]>('/api/categories'),
    fetchAPI<{ id: string; name: string }[]>('/api/tags').catch(() => []),
  ])

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-text-primary">New Article</h1>
      <ArticleForm categories={categories} tags={tags} action={createArticle} />
    </div>
  )
}

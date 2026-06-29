import { getCurrentAuthor } from '@/lib/auth/getSession'
import { fetchAPI } from '@/lib/api/server'
import type { CategoryResponse } from '@content-platform/shared'
import { redirect } from 'next/navigation'
import { ArticleForm } from '@/app/admin/articles/article-form'
import { createArticle } from '@/lib/actions/article-actions'

export const dynamic = 'force-dynamic'

export default async function StudioNewPage() {
  const author = await getCurrentAuthor()
  if (!author) redirect('/signin?next=/studio/new')

  const [categories, tags] = await Promise.all([
    fetchAPI<CategoryResponse[]>('/api/categories'),
    fetchAPI<{ id: string; name: string }[]>('/api/tags').catch(() => []),
  ])

  return (
    <div className="max-w-2xl">
      <h1 className="text-[17px] font-semibold text-text-primary mb-4">New Work</h1>
      <ArticleForm categories={categories} tags={tags} action={createArticle} />
    </div>
  )
}

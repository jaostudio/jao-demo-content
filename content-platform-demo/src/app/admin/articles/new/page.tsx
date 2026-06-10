import { getCurrentAuthor } from '@/lib/auth/getSession'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ArticleForm } from '../article-form'
import { createArticle } from '@/lib/actions/articles'

export const dynamic = 'force-dynamic'

export default async function NewArticlePage() {
  const author = await getCurrentAuthor()
  if (!author) redirect('/signin')

  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">New Article</h1>
      <ArticleForm categories={categories} tags={tags} action={createArticle} />
    </div>
  )
}

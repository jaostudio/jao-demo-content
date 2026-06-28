import { getCurrentAuthor } from '@/lib/auth/getSession'
import { fetchAPI } from '@/lib/api/server'
import type { ArticleSummary, AdminStatsResponse } from '@content-platform/shared'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { AdminDashboard } from '@/components/new/pages/admin/dashboard'

export const dynamic = 'force-dynamic'

export default async function StudioPage() {
  const author = await getCurrentAuthor()
  if (!author) redirect('/signin')

  const cookieStore = await cookies()
  const token = cookieStore.get('likha-token')?.value
  const authHeaders: Record<string, string> = {}
  if (token) authHeaders['Authorization'] = `Bearer ${token}`

  const [articles, stats] = await Promise.all([
    fetchAPI<ArticleSummary[]>('/api/studio/articles', { headers: authHeaders }),
    fetchAPI<AdminStatsResponse>('/api/studio/stats', { headers: authHeaders }),
  ])

  return (
    <AdminDashboard
      draftCount={stats.draftArticles}
      pendingCount={stats.pendingReview}
      publishedCount={stats.publishedArticles}
      articles={articles.map((a) => ({
        id: a.id,
        title: a.title,
        status: a.status,
        format: a.format,
        aiFreeDeclaration: a.aiFreeDeclaration,
        authorName: a.authorName,
        createdAt: a.createdAt,
        category: { slug: a.categoryId, name: a.categoryName },
      }))}
    />
  )
}

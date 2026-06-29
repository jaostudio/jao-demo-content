import { getCurrentAuthor } from '@/lib/auth/getSession'
import { fetchAPI } from '@/lib/api/server'
import type { ArticleSummary } from '@content-platform/shared'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { ReviewQueue } from '@/components/new/pages/admin/review-queue'

export const dynamic = 'force-dynamic'

export default async function ReviewPage() {
  const author = await getCurrentAuthor()
  if (!author) redirect('/signin')
  if (author.role !== 'ADMIN') redirect('/studio')

  const cookieStore = await cookies()
  const token = cookieStore.get('likha-token')?.value
  const authHeaders: Record<string, string> = {}
  if (token) authHeaders['Authorization'] = `Bearer ${token}`

  let articles: ArticleSummary[] = []
  let fetchError: string | null = null

  try {
    articles = await fetchAPI<ArticleSummary[]>('/api/admin/articles', { headers: authHeaders })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[admin/review] GET /api/admin/articles failed', message)
    fetchError = message
  }

  return <ReviewQueue articles={articles} fetchError={fetchError} />
}

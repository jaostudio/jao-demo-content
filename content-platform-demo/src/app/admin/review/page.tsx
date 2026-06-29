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

  const articles = await fetchAPI<ArticleSummary[]>('/api/admin/articles', { headers: authHeaders })

  return <ReviewQueue articles={articles} />
}

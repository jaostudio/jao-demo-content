import { getCurrentAuthor } from '@/lib/auth/getSession'
import { fetchAPI } from '@/lib/api/server'
import type { ArticleVersionResponse } from '@content-platform/shared'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function ArticleVersionsPage({ params }: { params: Promise<{ id: string }> }) {
  const author = await getCurrentAuthor()
  if (!author) redirect('/signin')

  const { id } = await params

  const cookieStore = await cookies()
  const token = cookieStore.get('likha-token')?.value
  const authHeaders: Record<string, string> = {}
  if (token) authHeaders['Authorization'] = `Bearer ${token}`

  let versions: ArticleVersionResponse[]
  try {
    versions = await fetchAPI<ArticleVersionResponse[]>(`/api/articles/${id}/versions`, { headers: authHeaders })
  } catch {
    notFound()
  }

  return (
    <div>
      <Link href={`/admin/articles/${id}/edit`} className="text-xs font-medium text-text-muted hover:text-primary">&larr; Back to editor</Link>
      <h1 className="mb-1 mt-3 text-lg font-semibold text-text-primary dark:text-slate-100">Version History</h1>
      <p className="mb-4 text-xs text-text-muted">Article versions</p>

      {versions.length === 0 && (
        <p className="py-8 text-center text-sm text-text-muted">No previous versions saved.</p>
      )}

      <div className="space-y-2">
        {versions.map((v, i) => (
          <div key={v.id} className="rounded-lg border border-border bg-card p-3 dark:border-border-dark dark:bg-card-dark">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-text-primary dark:text-slate-100">Version {versions.length - i}</span>
              <span className="text-[10px] text-text-muted">{new Date(v.createdAt).toLocaleString()}</span>
            </div>
            <details>
              <summary className="cursor-pointer text-[11px] text-text-muted hover:text-text-secondary">Preview content</summary>
              <pre className="mt-2 max-h-48 overflow-auto rounded bg-slate-50 p-2 text-[11px] dark:bg-slate-800">{v.content}</pre>
            </details>
          </div>
        ))}
      </div>
    </div>
  )
}

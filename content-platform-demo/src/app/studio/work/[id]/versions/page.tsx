import { getCurrentAuthor } from '@/lib/auth/getSession'
import { fetchAPI } from '@/lib/api/server'
import type { ArticleVersionResponse } from '@content-platform/shared'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function StudioVersionsPage({ params }: { params: Promise<{ id: string }> }) {
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
      <Link href={`/studio/work/${id}/edit`} className="text-[12px] font-medium text-fog-gray hover:text-text-primary transition-colors">
        &larr; Back to editor
      </Link>
      <h1 className="text-[17px] font-semibold text-text-primary mt-3 mb-1">Version History</h1>
      <p className="text-[11px] text-fog-gray mb-4">Process versions for this work</p>

      {versions.length === 0 && (
        <p className="py-12 text-center text-[13px] text-fog-gray">No previous versions saved.</p>
      )}

      <div className="space-y-2">
        {versions.map((v, i) => (
          <div key={v.id} className="kard p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[12px] font-medium text-text-primary">Version {versions.length - i}</span>
              <span className="text-[10px] text-fog-gray">{new Date(v.createdAt).toLocaleString()}</span>
            </div>
            <details>
              <summary className="cursor-pointer text-[11px] text-fog-gray hover:text-text-primary">Preview content</summary>
              <pre className="mt-2 max-h-48 overflow-auto rounded bg-surface-alt p-2 text-[11px] text-text-body">{v.content}</pre>
            </details>
          </div>
        ))}
      </div>
    </div>
  )
}

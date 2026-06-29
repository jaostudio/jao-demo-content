import type { Metadata } from 'next'
import { getCurrentAuthor } from '@/lib/auth/getSession'
import { fetchAPI } from '@/lib/api/server'
import type { ArticleSummary } from '@content-platform/shared'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { FileText, Clock, CheckCircle, Archive, ExternalLink, Sparkles } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Studio',
  description: 'Your creative workspace on Likha.',
}

interface StudioStats {
  totalArticles: number
  draftArticles: number
  pendingReview: number
  publishedArticles: number
  archivedArticles: number
}

export default async function StudioPage() {
  const author = await getCurrentAuthor()
  if (!author) redirect('/signin?next=/studio')
  if (author.role === 'READER') redirect('/')

  const cookieStore = await cookies()
  const token = cookieStore.get('likha-token')?.value
  const authHeaders: Record<string, string> = {}
  if (token) authHeaders['Authorization'] = `Bearer ${token}`

  let articles: ArticleSummary[] = []
  let stats: StudioStats = { totalArticles: 0, draftArticles: 0, pendingReview: 0, publishedArticles: 0, archivedArticles: 0 }

  try {
    const [arts, st] = await Promise.all([
      fetchAPI<ArticleSummary[]>('/api/studio/articles', { headers: authHeaders }),
      fetchAPI<StudioStats>('/api/studio/stats', { headers: authHeaders }),
    ])
    articles = arts
    stats = st
  } catch {
    // backend unavailable — render empty
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-surface-alt text-graphite border-hairline'
      case 'PENDING_REVIEW': return 'bg-voltage-pink/10 text-voltage-pink border-voltage-pink/20'
      case 'PUBLISHED': return 'bg-reactor-green/10 text-reactor-green border-reactor-green/20'
      case 'ARCHIVED': return 'bg-surface-alt text-fog-gray border-hairline'
      default: return ''
    }
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT': return <FileText className="h-3.5 w-3.5" />
      case 'PENDING_REVIEW': return <Clock className="h-3.5 w-3.5" />
      case 'PUBLISHED': return <CheckCircle className="h-3.5 w-3.5" />
      case 'ARCHIVED': return <Archive className="h-3.5 w-3.5" />
      default: return null
    }
  }

  const statusLabel = (status: string) => {
    switch (status) {
      case 'PENDING_REVIEW': return 'In Review'
      default: return status.charAt(0) + status.slice(1).toLowerCase()
    }
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="kard p-4">
          <p className="text-[22px] font-semibold text-text-primary">{stats.draftArticles}</p>
          <p className="text-[11px] text-fog-gray mt-1 flex items-center gap-1">
            <FileText className="h-3 w-3" strokeWidth={1.5} />
            Drafts
          </p>
        </div>
        <div className="kard p-4">
          <p className="text-[22px] font-semibold text-text-primary">{stats.pendingReview}</p>
          <p className="text-[11px] text-fog-gray mt-1 flex items-center gap-1">
            <Clock className="h-3 w-3 text-voltage-pink" strokeWidth={1.5} />
            In Review
          </p>
        </div>
        <div className="kard p-4">
          <p className="text-[22px] font-semibold text-text-primary">{stats.publishedArticles}</p>
          <p className="text-[11px] text-fog-gray mt-1 flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-reactor-green" strokeWidth={1.5} />
            Live
          </p>
        </div>
        <div className="kard p-4">
          <p className="text-[22px] font-semibold text-text-primary">{stats.archivedArticles}</p>
          <p className="text-[11px] text-fog-gray mt-1 flex items-center gap-1">
            <Archive className="h-3 w-3" strokeWidth={1.5} />
            Archived
          </p>
        </div>
      </div>

      {/* Works — Desktop Table */}
      <div className="hidden sm:block kard overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-hairline bg-surface-alt dark:bg-surface-dark">
                <th className="px-4 py-2.5 text-left font-medium text-fog-gray">Work</th>
                <th className="px-4 py-2.5 text-left font-medium text-fog-gray hidden sm:table-cell">Format</th>
                <th className="px-4 py-2.5 text-left font-medium text-fog-gray hidden md:table-cell">Category</th>
                <th className="px-4 py-2.5 text-left font-medium text-fog-gray">Status</th>
                <th className="px-4 py-2.5 text-left font-medium text-fog-gray hidden sm:table-cell">Date</th>
                <th className="px-4 py-2.5 text-right font-medium text-fog-gray">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {articles.map((a) => (
                <tr key={a.id} className="hover:bg-surface-alt transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-text-primary line-clamp-1">{a.title}</p>
                      {a.aiFreeDeclaration && (
                        <Sparkles className="h-3 w-3 shrink-0 text-reactor-green/60" strokeWidth={1.5} />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-graphite hidden sm:table-cell">
                    <span className="text-[11px]">{a.format}</span>
                  </td>
                  <td className="px-4 py-2.5 text-graphite hidden md:table-cell">{a.categoryName}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium border ${statusColor(a.status)}`}>
                      {statusIcon(a.status)}
                      {statusLabel(a.status)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-fog-gray hidden sm:table-cell">
                    {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Link
                      href={`/studio/work/${a.id}/edit`}
                      className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium text-graphite hover:text-text-primary hover:bg-surface-alt transition-colors"
                    >
                      Edit
                      <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {articles.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-[13px] text-fog-gray">Your studio is quiet. Start with a sketch, a note, or a finished work.</p>
              <Link href="/studio/new" className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-reactor-green hover:underline">
                New Work
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Works — Mobile Cards */}
      <div className="space-y-2 sm:hidden">
        {articles.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[13px] text-fog-gray">Your studio is quiet. Start with a sketch, a note, or a finished work.</p>
            <Link href="/studio/new" className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-reactor-green hover:underline">
              New Work
            </Link>
          </div>
        ) : (
          articles.map((a) => (
            <div key={a.id} className="kard p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[13px] font-medium text-text-primary line-clamp-1">{a.title}</p>
                    {a.aiFreeDeclaration && (
                      <Sparkles className="h-3 w-3 shrink-0 text-reactor-green/60" strokeWidth={1.5} />
                    )}
                  </div>
                  <p className="text-[11px] text-graphite mt-0.5">{a.format}{a.categoryName ? ` · ${a.categoryName}` : ''}</p>
                </div>
                <Link
                  href={`/studio/work/${a.id}/edit`}
                  className="shrink-0 inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium text-graphite hover:text-text-primary hover:bg-surface-alt transition-colors"
                >
                  Edit
                </Link>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-hairline">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border ${statusColor(a.status)}`}>
                  {statusIcon(a.status)}
                  {statusLabel(a.status)}
                </span>
                <span className="text-[10px] text-fog-gray">
                  {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

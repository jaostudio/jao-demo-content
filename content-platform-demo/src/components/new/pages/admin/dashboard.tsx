import { Card } from '../../ui/card'
import { FileText, Clock, CheckCircle, Archive, Sparkles } from 'lucide-react'
import { TransitionButtons } from '@/components/transition-buttons'

interface ArticleSummary {
  id: string
  title: string
  status: string
  format: string
  aiFreeDeclaration: boolean
  authorName: string
  createdAt: Date | string
  category: { slug: string; name: string }
}

interface AdminDashboardProps {
  draftCount: number
  pendingCount: number
  publishedCount: number
  articles: ArticleSummary[]
  fetchError?: string | null
}

export function AdminOverview({ draftCount, pendingCount, publishedCount, articles, fetchError }: AdminDashboardProps) {
  const statusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-surface-alt text-graphite border-hairline'
      case 'PENDING_REVIEW': return 'bg-surface-alt text-graphite border-hairline'
      case 'PUBLISHED': return 'bg-surface-alt text-graphite border-hairline'
      case 'ARCHIVED': return 'bg-surface-alt text-fog-gray border-hairline'
      default: return ''
    }
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT': return <FileText className="h-4 w-4" />
      case 'PENDING_REVIEW': return <Clock className="h-4 w-4" />
      case 'PUBLISHED': return <CheckCircle className="h-4 w-4" />
      case 'ARCHIVED': return <Archive className="h-4 w-4" />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-text-primary">Overview</h1>
        <p className="text-[11px] text-fog-gray mt-0.5">Works across all studios</p>
      </div>

      {fetchError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
          Could not load dashboard data. Moderation tools are limited.
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-alt dark:bg-surface-dark">
              <FileText className="h-4 w-4 text-fog-gray" />
            </div>
            <div>
              <p className="text-[17px] font-semibold text-text-primary">{draftCount}</p>
              <p className="text-[11px] text-fog-gray">Drafts</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-alt dark:bg-surface-dark">
              <Clock className="h-4 w-4 text-fog-gray" />
            </div>
            <div>
              <p className="text-[17px] font-semibold text-text-primary">{pendingCount}</p>
              <p className="text-[11px] text-fog-gray">In Review</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-alt dark:bg-surface-dark">
              <CheckCircle className="h-4 w-4 text-fog-gray" />
            </div>
            <div>
              <p className="text-[17px] font-semibold text-text-primary">{publishedCount}</p>
              <p className="text-[11px] text-fog-gray">Live</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-hairline bg-surface-alt dark:bg-surface-dark">
                <th className="px-3 py-2 text-left font-medium text-fog-gray">Title</th>
                <th className="px-3 py-2 text-left font-medium text-fog-gray hidden md:table-cell">Author</th>
                <th className="px-3 py-2 text-left font-medium text-fog-gray">Status</th>
                <th className="px-3 py-2 text-left font-medium text-fog-gray hidden md:table-cell">Date</th>
                <th className="px-3 py-2 text-right font-medium text-fog-gray">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {articles.map((a) => (
                <tr key={a.id} className="hover:bg-surface-alt transition-colors">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-text-primary line-clamp-1">{a.title}</p>
                      {a.aiFreeDeclaration && (
                        <Sparkles className="h-3 w-3 shrink-0 text-fog-gray" />
                      )}
                    </div>
                    <p className="text-[10px] text-fog-gray mt-0.5 md:hidden">{a.authorName}</p>
                  </td>
                  <td className="px-3 py-2 text-graphite hidden md:table-cell">{a.authorName}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium border ${statusColor(a.status)}`}>
                      {statusIcon(a.status)}
                      {a.status === 'PENDING_REVIEW' ? 'In Review' : a.status.charAt(0) + a.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-fog-gray hidden md:table-cell">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <TransitionButtons articleId={a.id} status={a.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

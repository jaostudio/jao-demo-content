import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { FileText, Clock, CheckCircle, Archive, Plus, ExternalLink, Sparkles } from 'lucide-react'
import Link from 'next/link'

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
}

export function AdminDashboard({ draftCount, pendingCount, publishedCount, articles }: AdminDashboardProps) {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-text-primary">Pangkalahatang View</h1>
          <p className="text-[11px] text-fog-gray mt-0.5">All articles in the system</p>
        </div>
        <Link href="/admin/articles/new">
          <Button variant="dark" size="sm">
            <Plus className="h-3.5 w-3.5" />
            New Article
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
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
              <p className="text-[11px] text-fog-gray">Pending Review</p>
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
              <p className="text-[11px] text-fog-gray">Published</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Article Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-hairline bg-surface-alt dark:bg-surface-dark">
                <th className="px-3 py-2 text-left font-medium text-fog-gray">Title</th>
                <th className="px-3 py-2 text-left font-medium text-fog-gray hidden md:table-cell">Format</th>
                <th className="px-3 py-2 text-left font-medium text-fog-gray hidden md:table-cell">Author</th>
                <th className="px-3 py-2 text-left font-medium text-fog-gray">Status</th>
                <th className="px-3 py-2 text-left font-medium text-fog-gray hidden md:table-cell">Date</th>
                <th className="px-3 py-2 text-right font-medium text-fog-gray">Action</th>
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
                    <p className="text-[10px] text-fog-gray mt-0.5 md:hidden">{a.authorName} · {a.category.name}</p>
                  </td>
                  <td className="px-3 py-2 text-graphite hidden md:table-cell">
                    <span className="text-[11px]">{a.format}</span>
                  </td>
                  <td className="px-3 py-2 text-graphite hidden md:table-cell">{a.authorName}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium border ${statusColor(a.status)}`}>
                      {statusIcon(a.status)}
                      {a.status === 'PENDING_REVIEW' ? 'For Review' : a.status.charAt(0) + a.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-fog-gray hidden md:table-cell">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Link href={`/admin/articles/${a.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
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

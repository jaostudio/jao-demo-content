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
      case 'DRAFT': return 'bg-surface-alt text-text-secondary border-border'
      case 'PENDING_REVIEW': return 'bg-warning-light text-amber-800 border-warning/30'
      case 'PUBLISHED': return 'bg-success-light text-green-800 border-success/30'
      case 'ARCHIVED': return 'bg-surface-alt text-text-secondary border-border'
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
          <h1 className="text-lg font-display font-bold text-text-primary">Pangkalahatang View</h1>
          <p className="text-xs text-text-muted mt-0.5">All articles in the system</p>
        </div>
        <Link href="/admin/articles/new">
          <Button variant="accent" size="sm">
            <Plus className="h-3.5 w-3.5" />
            New Article
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-alt">
              <FileText className="h-4 w-4 text-text-muted" />
            </div>
            <div>
              <p className="text-lg font-bold text-text-primary">{draftCount}</p>
              <p className="text-[11px] text-text-muted">Drafts</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-warning/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-light">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-text-primary">{pendingCount}</p>
              <p className="text-[11px] text-text-muted">Pending Review</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-success/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-light">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-text-primary">{publishedCount}</p>
              <p className="text-[11px] text-text-muted">Published</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Article Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-alt">
                <th className="px-4 py-3 text-left font-medium text-text-muted">Title</th>
                <th className="px-4 py-3 text-left font-medium text-text-muted hidden md:table-cell">Format</th>
                <th className="px-4 py-3 text-left font-medium text-text-muted hidden md:table-cell">Author</th>
                <th className="px-4 py-3 text-left font-medium text-text-muted">Status</th>
                <th className="px-4 py-3 text-left font-medium text-text-muted hidden md:table-cell">Date</th>
                <th className="px-4 py-3 text-right font-medium text-text-muted">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {articles.map((a) => (
                <tr key={a.id} className="hover:bg-surface-alt transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-text-primary line-clamp-1">{a.title}</p>
                      {a.aiFreeDeclaration && (
                        <Sparkles className="h-3 w-3 shrink-0 text-reactor-green" />
                      )}
                    </div>
                    <p className="text-[10px] text-text-muted mt-0.5 md:hidden">{a.authorName} · {a.category.name}</p>
                  </td>
                  <td className="px-4 py-3 text-text-secondary hidden md:table-cell">
                    <span className="text-[11px]">{a.format}</span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary hidden md:table-cell">{a.authorName}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium border ${statusColor(a.status)}`}>
                      {statusIcon(a.status)}
                      {a.status === 'PENDING_REVIEW' ? 'For Review' : a.status.charAt(0) + a.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-muted hidden md:table-cell">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
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

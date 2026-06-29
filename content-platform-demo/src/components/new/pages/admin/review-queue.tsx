'use client'

import { Card } from '../../ui/card'
import { Clock, Shield, Sparkles, Flag } from 'lucide-react'
import { TransitionButtons } from '@/components/transition-buttons'

interface ArticleSummary {
  id: string
  title: string
  status: string
  format: string
  aiFreeDeclaration: boolean
  authorName: string
  createdAt: Date | string
  category?: { slug: string; name: string }
}

interface ReviewQueueProps {
  articles: ArticleSummary[]
}

export function ReviewQueue({ articles }: ReviewQueueProps) {
  const pending = articles.filter((a) => a.status === 'PENDING_REVIEW')
  const reviewed = articles.filter((a) => a.status !== 'PENDING_REVIEW')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-text-primary">Review</h1>
        <p className="text-[11px] text-fog-gray mt-0.5">
          Works waiting for review. Check provenance, process notes, and publication status before approving.
        </p>
      </div>

      {pending.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-medium text-text-primary">Pending Review ({pending.length})</h2>
          </div>
          <div className="space-y-2">
            {pending.map((a) => (
              <Card key={a.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-text-primary line-clamp-1">{a.title}</h3>
                      {a.aiFreeDeclaration && (
                        <Sparkles className="h-3.5 w-3.5 shrink-0 text-fog-gray" aria-label="AI-Free Declaration" />
                      )}
                    </div>
                    <p className="text-[11px] text-fog-gray mt-1">
                      {a.authorName}
                      {a.category?.name && <span> · {a.category.name}</span>}
                      <span> · {new Date(a.createdAt).toLocaleDateString()}</span>
                    </p>
                    <p className="text-[11px] text-fog-gray mt-0.5">Format: {a.format}</p>
                  </div>
                  <div className="shrink-0">
                    <TransitionButtons articleId={a.id} status={a.status} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {pending.length === 0 && (
        <Card className="p-8 text-center">
          <Shield className="h-8 w-8 mx-auto text-fog-gray mb-3" />
          <p className="text-sm font-medium text-text-primary">No works pending review</p>
          <p className="text-[11px] text-fog-gray mt-1">All submitted works have been reviewed.</p>
        </Card>
      )}

      {reviewed.length > 0 && (
        <div className="pt-4 border-t border-hairline">
          <div className="flex items-center gap-2 mb-3">
            <Flag className="h-4 w-4 text-fog-gray" />
            <h2 className="text-sm font-medium text-text-primary">All Works ({reviewed.length})</h2>
          </div>
          <div className="space-y-1">
            {reviewed.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-1 py-2 text-xs">
                <span className="text-text-primary line-clamp-1">{a.title}</span>
                <span className="text-fog-gray shrink-0 ml-4">{a.status === 'PUBLISHED' ? 'Live' : a.status === 'DRAFT' ? 'Draft' : a.status === 'ARCHIVED' ? 'Archived' : a.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

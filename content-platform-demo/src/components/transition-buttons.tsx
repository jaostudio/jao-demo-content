'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const actionMap: Record<string, { action: string; label: string; variant: string }[]> = {
  DRAFT: [{ action: 'submit', label: 'Submit', variant: 'blue' }],
  PENDING_REVIEW: [
    { action: 'approve', label: 'Approve', variant: 'green' },
    { action: 'reject', label: 'Reject', variant: 'red' },
  ],
  PUBLISHED: [{ action: 'archive', label: 'Archive', variant: 'red' }],
}

export function TransitionButtons({ articleId, status }: { articleId: string; status: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const actions = actionMap[status]
  if (!actions) return null

  async function handle(action: string) {
    setLoading(action)
    await fetch(`/api/articles/${articleId}/transition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    router.refresh()
    setLoading(null)
  }

  const variantClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    green: 'bg-green-100 text-green-700 hover:bg-green-200',
    red: 'bg-red-100 text-red-700 hover:bg-red-200',
  }

  return (
    <div className="flex gap-1">
      {actions.map((a) => (
        <button
          key={a.action}
          onClick={() => handle(a.action)}
          disabled={loading === a.action}
          className={`rounded px-2 py-1 text-xs font-medium transition-colors ${variantClasses[a.variant]} disabled:opacity-50`}
        >
          {loading === a.action ? '...' : a.label}
        </button>
      ))}
    </div>
  )
}

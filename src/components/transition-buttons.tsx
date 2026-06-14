'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { useEffectiveRole } from '@/hooks/use-effective-role'

const actionMap: Record<string, { action: string; label: string; variant: string; destructive?: boolean }[]> = {
  DRAFT: [
    { action: 'submit', label: 'Submit', variant: 'primary' },
    { action: 'delete', label: 'Delete', variant: 'danger', destructive: true },
  ],
  PENDING_REVIEW: [
    { action: 'approve', label: 'Approve', variant: 'success' },
    { action: 'reject', label: 'Reject', variant: 'danger', destructive: true },
    { action: 'delete', label: 'Delete', variant: 'danger', destructive: true },
  ],
  PUBLISHED: [
    { action: 'archive', label: 'Archive', variant: 'danger', destructive: true },
    { action: 'delete', label: 'Delete', variant: 'danger', destructive: true },
  ],
  ARCHIVED: [
    { action: 'restore', label: 'Restore', variant: 'primary' },
    { action: 'delete', label: 'Delete', variant: 'danger', destructive: true },
  ],
}

const confirmMessages: Record<string, { title: string; description: string }> = {
  archive: {
    title: 'Archive this article?',
    description: 'It will be hidden from public pages. You can restore it later.',
  },
  reject: {
    title: 'Reject this article?',
    description: 'It will be sent back to draft. The author can resubmit after making changes.',
  },
  delete: {
    title: 'Delete this article permanently?',
    description: 'This action cannot be undone. The article and all its data will be removed.',
  },
}

export function TransitionButtons({ articleId, status }: { articleId: string; status: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<string | null>(null)
  const { isDemoMode } = useEffectiveRole()

  const actions = actionMap[status]
  if (!actions) return null

  async function handle(action: string) {
    setConfirmAction(null)

    if (isDemoMode) {
      const verb = action === 'delete' ? 'deleted' : action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : action === 'archive' ? 'archived' : action === 'restore' ? 'restored' : 'updated'
      toast('Demo mode', { description: `You would have ${verb} this article. Log in to perform real changes.` })
      return
    }

    setLoading(action)
    try {
      if (action === 'delete') {
        const res = await fetch(`/api/articles/${articleId}`, { method: 'DELETE' })
        const data = await res.json()
        if (!res.ok) {
          toast.error(data.error || 'Delete failed')
          return
        }
        toast.success('Article permanently deleted')
        router.refresh()
        return
      }

      const res = await fetch(`/api/articles/${articleId}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Something went wrong')
        return
      }
      toast.success(
        action === 'approve' ? 'Article approved and published' :
        action === 'archive' ? 'Article archived' :
        action === 'reject' ? 'Article rejected' :
        action === 'restore' ? 'Article restored to draft' :
        'Article updated',
      )
      router.refresh()
    } catch {
      toast.error('Network error. Check your connection.')
    } finally {
      setLoading(null)
    }
  }

  const variantClasses: Record<string, string> = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600',
    danger: 'bg-danger text-white hover:bg-red-600',
  }

  return (
    <>
      <div className="flex gap-1">
        {actions.map((a) => (
          <button
            key={a.action}
            onClick={() => {
              if (a.destructive) {
                setConfirmAction(a.action)
              } else {
                handle(a.action)
              }
            }}
            disabled={loading === a.action}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${variantClasses[a.variant]} disabled:opacity-50`}
          >
            {loading === a.action ? '...' : a.label}
          </button>
        ))}
      </div>

      {confirmAction && confirmMessages[confirmAction] && (
        <AlertDialog
          open={true}
          onOpenChange={(open) => { if (!open) setConfirmAction(null) }}
          title={confirmMessages[confirmAction].title}
          description={confirmMessages[confirmAction].description}
          confirmLabel={
            confirmAction === 'delete' ? 'Delete Permanently' :
            confirmAction === 'archive' ? 'Archive' : 'Reject'
          }
          onConfirm={() => handle(confirmAction)}
          variant="danger"
        />
      )}
    </>
  )
}

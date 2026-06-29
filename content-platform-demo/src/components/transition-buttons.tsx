'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { useEffectiveRole } from '@/hooks/use-effective-role'

const ACTION_KEYS: Record<string, string> = {
  submit: 'article.submit_for_review',
  approve: 'article.approve',
  reject: 'article.reject',
  archive: 'article.archive',
  restore: 'article.restore',
  delete: 'article.delete_permanently',
}

const actionMap: Record<string, { action: string; labelKey: string; variant: string; destructive?: boolean }[]> = {
  DRAFT: [
    { action: 'submit', labelKey: 'article.submit_for_review', variant: 'primary' },
    { action: 'delete', labelKey: 'article.delete_permanently', variant: 'danger', destructive: true },
  ],
  PENDING_REVIEW: [
    { action: 'approve', labelKey: 'article.approve', variant: 'success' },
    { action: 'reject', labelKey: 'article.reject', variant: 'danger', destructive: true },
    { action: 'delete', labelKey: 'article.delete_permanently', variant: 'danger', destructive: true },
  ],
  PUBLISHED: [
    { action: 'archive', labelKey: 'article.archive', variant: 'danger', destructive: true },
    { action: 'delete', labelKey: 'article.delete_permanently', variant: 'danger', destructive: true },
  ],
  ARCHIVED: [
    { action: 'restore', labelKey: 'article.restore', variant: 'primary' },
    { action: 'delete', labelKey: 'article.delete_permanently', variant: 'danger', destructive: true },
  ],
}

export function TransitionButtons({ articleId, status }: { articleId: string; status: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<string | null>(null)
  const { isDemoMode } = useEffectiveRole()
  const t = useTranslations()
  const err = useTranslations('errors')
  const toastT = useTranslations('toast')

  const actions = actionMap[status]
  if (!actions) return null

  const verbMap: Record<string, string> = {
    delete: 'deleted',
    approve: 'approved',
    reject: 'rejected',
    archive: 'archived',
    restore: 'restored',
  }

  async function handle(action: string) {
    setConfirmAction(null)

    if (isDemoMode) {
      const verb = verbMap[action] || 'updated'
      toast(toastT('demo_title'), { description: toastT('demo_message', { action: verb }) })
      return
    }

    setLoading(action)
    try {
      if (action === 'delete') {
        const res = await fetch(`/api/articles/${articleId}`, { method: 'DELETE' })
        const data = await res.json()
        if (!res.ok) {
          toast.error(data.error || err('something_wrong'))
          return
        }
        toast.success(toastT('article_archived'))
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
        toast.error(data.error || err('something_wrong'))
        return
      }
      const toastKey =
        action === 'approve' ? 'article_approved' :
        action === 'archive' ? 'article_archived' :
        action === 'reject' ? 'article_rejected' :
        'article_updated'
      toast.success(toastT(toastKey))
      router.refresh()
    } catch {
      toast.error(err('network_error'))
    } finally {
      setLoading(null)
    }
  }

  const variantClasses: Record<string, string> = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    success: 'bg-primary text-white hover:bg-primary-dark',
    danger: 'bg-danger text-white hover:bg-danger',
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
            {loading === a.action ? '...' : t(a.labelKey)}
          </button>
        ))}
      </div>

      {confirmAction && ['archive', 'reject'].includes(confirmAction) && (
        <AlertDialog
          open={true}
          onOpenChange={(open) => { if (!open) setConfirmAction(null) }}
          title={t(`confirm.${confirmAction}_title`)}
          description={t(`confirm.${confirmAction}_desc`)}
          confirmLabel={t(`confirm.${confirmAction}_btn`)}
          onConfirm={() => handle(confirmAction)}
          variant="danger"
        />
      )}
    </>
  )
}

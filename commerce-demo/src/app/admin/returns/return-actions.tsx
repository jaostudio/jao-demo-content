'use client'

import { useRouter } from 'next/navigation'
import { updateReturnStatus } from '@/lib/actions/returns'

export function ReturnActions({ returnId, status }: { returnId: string; status: string }) {
  const router = useRouter()

  const handleAction = async (newStatus: string) => {
    await updateReturnStatus(returnId, newStatus)
    router.refresh()
  }

  if (status !== 'pending') return <span className="text-xs text-muted">—</span>

  return (
    <div className="flex gap-2">
      <button onClick={() => handleAction('approved')} className="rounded-lg bg-leafy-green px-3 py-1 text-xs font-semibold text-white hover:brightness-90">
        Approve
      </button>
      <button onClick={() => handleAction('rejected')} className="rounded-lg bg-flag-red px-3 py-1 text-xs font-semibold text-white hover:brightness-90">
        Reject
      </button>
    </div>
  )
}

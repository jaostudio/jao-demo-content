'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { RotateCcw } from 'lucide-react'
import { getReturnRequests, updateReturnStatus } from '@/lib/actions/returns'

type ReturnRequest = {
  id: string
  reason: string
  status: string
  adminNotes: string | null
  createdAt: Date
}

export function ReturnManagement({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [returns, setReturns] = useState<ReturnRequest[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReturns = useCallback(async () => {
    setLoading(true)
    const result = await getReturnRequests(orderId)
    if (result.success) setReturns(result.returnRequests as ReturnRequest[])
    setLoading(false)
  }, [orderId])

  useEffect(() => { fetchReturns() }, [fetchReturns])

  const handleAction = async (returnId: string, status: string) => {
    await updateReturnStatus(returnId, status)
    router.refresh()
    fetchReturns()
  }

  if (loading || returns.length === 0) return null

  return (
    <div className="mt-6 rounded-xl border border-flag-yellow/20 p-6 dark:border-flag-yellow/30">
      <div className="flex items-center gap-2">
        <RotateCcw className="h-4 w-4 text-flag-yellow" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-flag-yellow">Return Requests</h2>
      </div>
      <div className="mt-4 space-y-3">
        {returns.map((r) => (
          <div key={r.id} className="rounded-lg border border-subtle p-3">
            <p className="text-xs text-muted">{new Date(r.createdAt).toLocaleDateString()}</p>
            <p className="mt-1 text-sm font-medium">{r.reason}</p>
            <p className="mt-0.5 text-xs text-muted">Status: {r.status}</p>
            {r.status === 'pending' && (
              <div className="mt-2 flex gap-2">
                <button onClick={() => handleAction(r.id, 'approved')} className="rounded-lg bg-leafy-green px-3 py-1 text-xs font-semibold text-white">Approve</button>
                <button onClick={() => handleAction(r.id, 'rejected')} className="rounded-lg bg-flag-red px-3 py-1 text-xs font-semibold text-white">Reject</button>
              </div>
            )}
            {r.adminNotes && <p className="mt-1 text-xs italic text-muted">Note: {r.adminNotes}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

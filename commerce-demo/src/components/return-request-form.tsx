'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { CheckCircle, XCircle } from 'lucide-react'

export function ReturnRequestForm({ orderId, orderNumber }: { orderId: string; orderNumber: string }) {
  const { data: session } = useSession()
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  if (!session?.user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) return
    setSubmitting(true)
    setStatus('idle')
    try {
      const res = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, reason: reason.trim() }),
      })
      if (res.ok) {
        setStatus('success')
        setReason('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
    setSubmitting(false)
  }

  return (
    <div className="rounded-xl border border-subtle p-6 dark:border-subtle">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Return Request</h2>
      <p className="mt-1 text-xs text-muted">Order #{orderNumber}</p>

      {status === 'success' ? (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-leafy-green/10 px-4 py-3 text-sm text-leafy-green">
          <CheckCircle className="h-4 w-4 shrink-0" />
          Na-submit na ang return request mo. Abangan ang update mula sa tindera.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ilagay ang dahilan ng return..."
            rows={3}
            required
            className="w-full rounded-lg border border-subtle bg-white px-3 py-2 text-sm dark:bg-surface"
          />
          {status === 'error' && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-flag-red">
              <XCircle className="h-3.5 w-3.5" />
              May error sa pag-submit. Subukan muli.
            </div>
          )}
          <button
            type="submit"
            disabled={submitting || !reason.trim()}
            className="mt-3 rounded-lg bg-flag-blue px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Isumite ang Return'}
          </button>
        </form>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Truck } from 'lucide-react'
import { assignRider } from '@/lib/actions/rider'

export function RiderAssignment({ orderId, currentRider, currentEta }: { orderId: string; currentRider: string | null; currentEta: string | null }) {
  const router = useRouter()
  const [riderName, setRiderName] = useState(currentRider ?? '')
  const [eta, setEta] = useState(currentEta ?? '')
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    setMessage('')
    const result = await assignRider(orderId, riderName, eta)
    if (result.success) {
      setMessage('Rider assigned!')
      router.refresh()
    } else {
      setMessage(result.error ?? 'Failed')
    }
    setPending(false)
  }

  return (
    <div className="mt-6 rounded-xl border border-flag-blue/20 p-6 dark:border-flag-blue/30">
      <div className="flex items-center gap-2">
        <Truck className="h-4 w-4 text-flag-blue" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-flag-blue">Rider / Rider</h2>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-wrap gap-3">
        <input
          value={riderName}
          onChange={(e) => setRiderName(e.target.value)}
          placeholder="Rider name"
          className="rounded-lg border border-subtle bg-white px-3 py-2 text-sm dark:bg-surface"
        />
        <input
          value={eta}
          onChange={(e) => setEta(e.target.value)}
          placeholder="ETA (e.g. 30 mins)"
          className="rounded-lg border border-subtle bg-white px-3 py-2 text-sm dark:bg-surface"
        />
        <button type="submit" disabled={pending || !riderName.trim()} className="rounded-lg bg-flag-blue px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">
          {pending ? '...' : 'Assign'}
        </button>
      </form>
      {message && <p className="mt-2 text-xs text-muted">{message}</p>}
    </div>
  )
}

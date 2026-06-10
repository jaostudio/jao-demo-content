'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { updateFulfillmentState } from '@/lib/actions/orders'

const transitions: Record<string, { label: string; nextState: string }[]> = {
  unfulfilled: [{ label: 'Process → Nasa tricycle', nextState: 'processing' }],
  processing: [{ label: 'Ship → Nasa courier na', nextState: 'shipped' }],
  shipped: [{ label: 'Deliver → Nadeliver na', nextState: 'delivered' }],
  delivered: [],
  returned: [],
}

export function FulfillmentActions({ orderId, currentState }: { orderId: string; currentState: string }) {
  const router = useRouter()
  const [pending, setPending] = useState<string | null>(null)
  const [error, setError] = useState('')

  const actions = transitions[currentState] ?? []

  async function handleAction(nextState: string) {
    setPending(nextState)
    setError('')
    try {
      await updateFulfillmentState(orderId, nextState)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setPending(null)
    }
  }

  if (actions.length === 0 && !error) return null

  return (
    <div className="mt-6 rounded-xl border border-subtle p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Fulfillment Actions</h2>
      <div className="mt-3 flex flex-wrap gap-3">
        {actions.map(({ label, nextState }) => (
          <button
            key={nextState}
            onClick={() => handleAction(nextState)}
            disabled={pending !== null}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-flag-blue px-4 text-xs font-semibold text-white transition-all hover:brightness-90 disabled:opacity-50"
          >
            {pending === nextState ? '...' : label}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-flag-red">{error}</p>}
    </div>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { transitionOrderFulfillment } from '@/lib/actions/orders'

const transitions: Record<string, { label: string; event: 'process' | 'ship' | 'return_fulfillment' }[]> = {
  unfulfilled: [{ label: 'Process', event: 'process' }],
  processing: [{ label: 'Mark Shipped', event: 'ship' }],
  fulfilled: [{ label: 'Return', event: 'return_fulfillment' }],
  returned: [],
}

export function FulfillmentActions({ orderId, currentState }: { orderId: string; currentState: string }) {
  const router = useRouter()
  const [pending, setPending] = useState<string | null>(null)
  const [error, setError] = useState('')

  const actions = transitions[currentState] ?? []

  async function handleAction(event: 'process' | 'ship' | 'return_fulfillment') {
    setPending(event)
    setError('')
    try {
      await transitionOrderFulfillment(orderId, event)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setPending(null)
    }
  }

  if (actions.length === 0 && !error) return null

  return (
    <div className="mt-6 rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
      <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Fulfillment Actions</h2>
      <div className="mt-3 flex flex-wrap gap-3">
        {actions.map(({ label, event }) => (
          <button
            key={event}
            onClick={() => handleAction(event)}
            disabled={pending !== null}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-neutral-900 px-4 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {pending === event ? '...' : label}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

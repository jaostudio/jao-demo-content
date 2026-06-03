'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { transitionOrderPayment } from '@/lib/actions/orders'

const transitions: Record<string, { label: string; event: 'refund_payment' }[]> = {
  pending_payment: [],
  paid: [{ label: 'Refund', event: 'refund_payment' }],
  refunded: [],
}

export function PaymentActions({ orderId, currentState }: { orderId: string; currentState: string }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const actions = transitions[currentState] ?? []

  async function handleAction() {
    setPending(true)
    setError('')
    try {
      await transitionOrderPayment(orderId, 'refund_payment')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setPending(false)
    }
  }

  if (actions.length === 0 && !error) return null

  return (
    <div className="mt-4 rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
      <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Payment Actions</h2>
      <div className="mt-3 flex flex-wrap gap-3">
        {actions.map(({ label, event }) => (
          <button
            key={event}
            onClick={handleAction}
            disabled={pending}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-red-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-50"
          >
            {pending ? '...' : label}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

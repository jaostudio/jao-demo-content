'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { updatePaymentState } from '@/lib/actions/orders'

const transitions: Record<string, { label: string; nextState: string }[]> = {
  pending_payment: [
    { label: 'Mark as Paid', nextState: 'paid' },
    { label: 'Refund', nextState: 'refunded' },
  ],
  paid: [{ label: 'Refund', nextState: 'refunded' }],
  refunded: [],
}

export function PaymentActions({ orderId, currentState }: { orderId: string; currentState: string }) {
  const router = useRouter()
  const [pending, setPending] = useState<string | null>(null)
  const [error, setError] = useState('')

  const actions = transitions[currentState] ?? []

  async function handleAction(nextState: string) {
    setPending(nextState)
    setError('')
    try {
      await updatePaymentState(orderId, nextState)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setPending(null)
    }
  }

  if (actions.length === 0 && !error) return null

  return (
    <div className="mt-4 rounded-xl border border-subtle p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Payment Actions</h2>
      <div className="mt-3 flex flex-wrap gap-3">
        {actions.map(({ label, nextState }) => (
          <button
            key={nextState}
            onClick={() => handleAction(nextState)}
            disabled={pending !== null}
            className={`inline-flex h-9 items-center justify-center rounded-lg px-4 text-xs font-semibold text-white transition-all disabled:opacity-50 ${
              nextState === 'refunded'
                ? 'bg-flag-red hover:bg-flag-red'
                : 'bg-leafy-green hover:brightness-90'
            }`}
          >
            {pending === nextState ? '...' : label}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-flag-red">{error}</p>}
    </div>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { transitionOrderFulfillment } from '@/lib/actions/orders'
import { Loader2 } from 'lucide-react'

interface FulfillmentActionsProps {
  orderId: string
  fulfillmentState: string
}

export function FulfillmentActions({ orderId, fulfillmentState }: FulfillmentActionsProps) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function handle(action: 'process' | 'ship' | 'return_fulfillment') {
    setPending(true)
    try {
      await transitionOrderFulfillment(orderId, action)
      router.refresh()
    } catch {
      setPending(false)
    }
  }

  if (fulfillmentState === 'UNFULFILLED') {
    return (
      <button
        onClick={() => handle('process')}
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500 disabled:opacity-50"
      >
        {pending && <Loader2 className="h-3 w-3 animate-spin" />}
        Process
      </button>
    )
  }

  if (fulfillmentState === 'PROCESSING') {
    return (
      <button
        onClick={() => handle('ship')}
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
      >
        {pending && <Loader2 className="h-3 w-3 animate-spin" />}
        Mark shipped
      </button>
    )
  }

  if (fulfillmentState === 'FULFILLED') {
    return (
      <span className="rounded-lg bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
        Delivered
      </span>
    )
  }

  if (fulfillmentState === 'RETURNED') {
    return (
      <span className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
        Returned
      </span>
    )
  }

  return null
}

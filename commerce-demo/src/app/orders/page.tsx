'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getOrder } from '@/lib/actions/orders'
type MiniOrder = {
  id: string
  orderNumber: string
  name: string | null
  total: number
  fulfillmentState: string
  createdAt: Date
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<MiniOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('palengkee-orders')
    if (!stored) {
      setLoading(false)
      return
    }
    const ids: string[] = JSON.parse(stored)
    Promise.all(ids.map((id) => getOrder(id).catch(() => null)))
      .then((results) => setOrders(results.filter(Boolean) as MiniOrder[]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="mx-auto h-8 w-48 animate-pulse-soft rounded bg-subtle dark:bg-surface" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <span className="text-6xl">📦</span>
        <h1 className="mt-6 text-2xl font-bold">Wala ka pang order.</h1>
        <p className="mt-2 text-muted">Mamili ka na sa Sari-Sari!</p>
        <Link
          href="/products"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-flag-blue px-6 text-sm font-semibold text-white shadow-lg shadow-flag-blue/25 transition-all hover:brightness-90"
        >
          Mamili Na!
        </Link>
      </div>
    )
  }

  const stageLabel = (state: string) => {
    const labels: Record<string, string> = {
      unfulfilled: 'Naka-plastic na',
      processing: 'Nasa tricycle',
      shipped: 'Nasa courier na',
      delivered: 'Nadeliver na',
      returned: 'Binalik',
    }
    return labels[state] ?? state
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-[var(--font-display)] text-2xl font-bold">My Orders</h1>
      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="flex items-center justify-between rounded-xl border border-subtle p-4 transition-all hover:border-subtle hover:shadow-md dark:bg-surface"
          >
            <div>
              <p className="font-mono text-xs text-flag-blue">{order.orderNumber}</p>
              <p className="mt-1 text-sm font-medium">{order.name}</p>
              <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">₱{(order.total / 100).toFixed(2)}</p>
              <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                order.fulfillmentState === 'delivered'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-surface text-muted dark:bg-surface'
              }`}>
                {stageLabel(order.fulfillmentState)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
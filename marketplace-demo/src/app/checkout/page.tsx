'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useCart } from '@/lib/store/cart'
import { createOrder } from '@/lib/actions/orders'

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, total, clearCart } = useCart()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  if (!session) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Sign in required</h1>
        <p className="mt-2 text-neutral-500">Please sign in to checkout.</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError('')

    const form = new FormData(e.currentTarget)
    form.set('items', JSON.stringify(items.map(({ listingId, vendorId, name, price, quantity }) => ({ listingId, vendorId, name, price, quantity }))))

    try {
      const result = await createOrder(form)
      clearCart()
      router.push(`/orders/${result.orderId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setPending(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
            <input id="name" name="name" required className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-950" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input id="email" name="email" type="email" required className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-950" />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium">Shipping Address</label>
            <textarea id="address" name="address" required rows={3} className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-950" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={pending} className="flex h-12 w-full items-center justify-center rounded-xl bg-neutral-900 text-sm font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900">
            {pending ? 'Processing...' : `Pay $${(total() / 100).toFixed(2)}`}
          </button>
        </form>

        <div>
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
            {items.map((item) => (
              <div key={item.listingId} className="flex items-center gap-4 py-4">
                <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-400">
                  {item.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">${((item.price * item.quantity) / 100).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4 text-lg font-bold dark:border-neutral-800">
            <span>Total</span>
            <span>${(total() / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

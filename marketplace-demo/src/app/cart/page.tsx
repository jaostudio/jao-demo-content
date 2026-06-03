'use client'

import Link from 'next/link'
import { useCart } from '@/lib/store/cart'
import { Trash2, Minus, Plus } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-neutral-500">Browse listings to add items.</p>
        <Link href="/listings" className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-neutral-900 px-6 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900">
          Browse Listings
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Shopping Cart</h1>

      <div className="mt-8 divide-y divide-neutral-200 dark:divide-neutral-800">
        {items.map((item) => (
          <div key={item.listingId} className="flex items-center gap-4 py-6">
            <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 font-bold">
              {item.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{item.name}</p>
              <p className="text-sm text-neutral-500">${(item.price / 100).toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item.listingId, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.listingId, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <p className="w-20 text-right font-semibold">${((item.price * item.quantity) / 100).toFixed(2)}</p>
            <button onClick={() => removeItem(item.listingId)} className="flex h-8 w-8 items-center justify-center text-neutral-400 hover:text-red-500 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <div className="flex items-center justify-between text-lg">
          <span className="font-semibold">Total</span>
          <span className="font-bold">${(total() / 100).toFixed(2)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-neutral-900 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}

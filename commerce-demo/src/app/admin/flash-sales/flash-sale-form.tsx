'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Product } from '@prisma/commerce-client'

export function FlashSaleForm({ products }: { products: Product[] }) {
  const router = useRouter()
  const [productId, setProductId] = useState('')
  const [discountPercent, setDiscountPercent] = useState(20)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/admin/flash-sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, discountPercent, startTime, endTime }),
    })
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label className="block text-sm font-medium">Product</label>
        <select value={productId} onChange={(e) => setProductId(e.target.value)} required className="mt-1 block w-full rounded-xl border border-subtle bg-white px-4 py-2.5 text-sm dark:bg-surface">
          <option value="">Select product...</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.nameTl} (₱{(p.price / 100).toFixed(2)})</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Discount (%)</label>
        <input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} min={1} max={100} className="mt-1 block w-full rounded-xl border border-subtle bg-white px-4 py-2.5 text-sm dark:bg-surface" />
      </div>
      <div>
        <label className="block text-sm font-medium">Start Time</label>
        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="mt-1 block w-full rounded-xl border border-subtle bg-white px-4 py-2.5 text-sm dark:bg-surface" />
      </div>
      <div>
        <label className="block text-sm font-medium">End Time</label>
        <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="mt-1 block w-full rounded-xl border border-subtle bg-white px-4 py-2.5 text-sm dark:bg-surface" />
      </div>
      <button type="submit" className="rounded-xl bg-flag-blue px-6 py-2 text-sm font-semibold text-white hover:brightness-90">
        Create Flash Sale
      </button>
    </form>
  )
}

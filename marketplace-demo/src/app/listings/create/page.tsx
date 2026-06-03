'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function CreateListingPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user as any
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  if (!session || user?.role !== 'VENDOR') {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Vendor access required</h1>
        <p className="mt-2 text-neutral-500">Sign in as a vendor to create listings.</p>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const res = await fetch('/api/listings', {
      method: 'POST',
      body: form,
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Failed to create listing')
      setPending(false)
      return
    }

    const { slug } = await res.json()
    router.push(`/listings/${slug}`)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Create Listing</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">Title</label>
          <input id="title" name="title" required className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-950" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium">Description</label>
          <textarea id="description" name="description" required rows={4} className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-950" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium">Price (cents)</label>
            <input id="price" name="price" type="number" required min={1} className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-950" />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium">Category</label>
            <select id="category" name="category" required className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-950">
              <option value="">Select...</option>
            </select>
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={pending} className="flex h-12 w-full items-center justify-center rounded-xl bg-neutral-900 text-sm font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900">
          {pending ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  )
}

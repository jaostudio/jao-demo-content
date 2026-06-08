'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImagePlus, Loader2, Plus, X } from 'lucide-react'

interface CreateListingFormProps {
  categories: { slug: string; name: string }[]
}

export function CreateListingForm({ categories }: CreateListingFormProps) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [imageUrls, setImageUrls] = useState<string[]>([''])

  function addImageField() {
    setImageUrls([...imageUrls, ''])
  }

  function removeImageField(index: number) {
    setImageUrls(imageUrls.filter((_, i) => i !== index))
  }

  function updateImageUrl(index: number, value: string) {
    const updated = [...imageUrls]
    updated[index] = value
    setImageUrls(updated)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const validUrls = imageUrls.filter(Boolean)
    if (validUrls.length > 0) {
      form.set('imageUrls', JSON.stringify(validUrls))
    }

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

    router.push('/dashboard/listings')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          required
          placeholder="e.g. Handwoven Kalinga Blanket"
          className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm placeholder:text-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          placeholder="Describe your craft — materials, story, inspiration..."
          className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm placeholder:text-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Price (₱) <span className="text-red-500">*</span>
          </label>
          <input
            id="price"
            name="price"
            type="number"
            required
            min={1}
            step="0.01"
            placeholder="0.00"
            className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm placeholder:text-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
          />
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Stock
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min={0}
            defaultValue={1}
            className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm placeholder:text-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            required
            className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
          >
            <option value="">Select...</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Images
        </label>
        <p className="mt-0.5 text-xs text-neutral-400">
          Paste image URLs (Unsplash, Cloudinary, etc.)
        </p>
        <div className="mt-2 space-y-2">
          {imageUrls.map((url, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="relative flex-1">
                <ImagePlus className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => updateImageUrl(i, e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="block w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                />
              </div>
              {imageUrls.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(i)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-400 hover:bg-neutral-100 hover:text-red-500 dark:hover:bg-neutral-800"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-500 hover:border-neutral-400 hover:text-neutral-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-300"
          >
            <Plus className="h-4 w-4" />
            Add another image
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isService"
          name="isService"
          type="checkbox"
          className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 dark:border-neutral-700"
        />
        <label htmlFor="isService" className="text-sm text-neutral-700 dark:text-neutral-300">
          This is a service (booking-based, not a physical product)
        </label>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary-500 text-sm font-semibold text-white shadow-warm-sm transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {pending ? 'Creating...' : 'Submit for Review'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-12 items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

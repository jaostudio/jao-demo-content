'use client'
import { useState } from 'react'
import { Star } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useLang } from '@/lib/use-lang'

export function ReviewForm({ productId }: { productId: string }) {
  const lang = useLang()
  const { data: session } = useSession()
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!session?.user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, comment, author: session.user?.name || 'Anonymous' }),
      })
      if (res.ok) {
        setRating(0)
        setComment('')
      }
    } catch { /* ignore */ }
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 rounded-lg border border-subtle p-4 dark:border-subtle">
      <p className="text-sm font-semibold">{lang === 'tl' ? 'Mag-iwan ng chismis' : 'Leave a review'}</p>
      <div className="mt-2 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)} onClick={() => setRating(star)} className="p-0.5">
            <Star className={`h-5 w-5 ${star <= (hovered || rating) ? 'fill-flag-yellow text-flag-yellow' : 'text-muted'}`} />
          </button>
        ))}
      </div>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder={lang === 'tl' ? 'Ikwento mo ang experience mo...' : 'Share your experience...'} rows={3} className="mt-2 w-full rounded-lg border border-subtle bg-white px-3 py-2 text-sm dark:bg-surface" />
      <button type="submit" disabled={submitting || rating === 0} className="mt-2 rounded-lg bg-flag-blue px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">{lang === 'tl' ? 'Send Chismis' : 'Send Review'}</button>
    </form>
  )
}

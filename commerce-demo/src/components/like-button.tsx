'use client'
import { Heart } from 'lucide-react'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

export function LikeButton({ productId, initialLiked, initialCount }: { productId: string; initialLiked: boolean; initialCount: number }) {
  const { data: session } = useSession()
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [pending, setPending] = useState(false)

  const handleToggle = async () => {
    if (!session?.user) return
    setPending(true)
    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      if (res.ok) {
        const data = await res.json()
        setLiked(data.liked)
        setCount(data.count)
      }
    } catch { /* ignore */ }
    setPending(false)
  }

  if (!session?.user) return null

  return (
    <button onClick={handleToggle} disabled={pending} className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${liked ? 'border-flag-red bg-flag-red/10 text-flag-red' : 'border-subtle text-muted hover:border-flag-red/50 hover:text-flag-red'}`}>
      <Heart className={`h-3.5 w-3.5 ${liked ? 'fill-flag-red' : ''}`} />
      {count}
    </button>
  )
}

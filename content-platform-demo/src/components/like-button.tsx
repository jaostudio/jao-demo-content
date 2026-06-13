'use client'

import { useState, useEffect, useCallback } from 'react'
import { Heart } from 'lucide-react'

interface LikeButtonProps {
  articleId: string
  initialLikes: number
}

export function LikeButton({ articleId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`liked:${articleId}`)
      if (stored === 'true') setLiked(true)
    } catch { /* noop */ }
  }, [articleId])

  const toggle = useCallback(async () => {
    if (loading) return
    setLoading(true)

    const action = liked ? 'unlike' : 'like'
    try {
      const res = await fetch(`/api/articles/${articleId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      if (data.likes !== undefined) {
        setLikes(data.likes)
        setLiked(!liked)
        try { localStorage.setItem(`liked:${articleId}`, String(!liked)) } catch { /* noop */ }
      }
    } catch { /* noop */ }
    setLoading(false)
  }, [articleId, liked, loading])

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-1 text-xs font-medium transition-colors ${
        liked ? 'text-voltage-pink' : 'text-text-muted hover:text-text-secondary'
      }`}
    >
      <Heart className={`h-3.5 w-3.5 ${liked ? 'fill-voltage-pink' : ''}`} />
      {likes}
    </button>
  )
}

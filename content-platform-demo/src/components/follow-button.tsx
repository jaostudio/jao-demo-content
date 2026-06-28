'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/new/ui/button'

interface FollowButtonProps {
  authorId: string
}

export function FollowButton({ authorId }: FollowButtonProps) {
  const { user } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    fetch(`/api/follows/${authorId}`)
      .then((r) => r.json())
      .then((data) => setIsFollowing(data.isFollowing))
      .catch(() => {})
  }, [user, authorId])

  async function toggleFollow() {
    if (!user) return
    setLoading(true)
    try {
      const token = localStorage.getItem('likha-token')
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      if (isFollowing) {
        await fetch(`/api/follows/${authorId}`, { method: 'DELETE', headers })
        setIsFollowing(false)
      } else {
        await fetch(`/api/follows/${authorId}`, { method: 'POST', headers })
        setIsFollowing(true)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <Button
      variant={isFollowing ? 'outline' : 'dark'}
      size="sm"
      onClick={toggleFollow}
      disabled={loading}
    >
      {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
    </Button>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/new/ui/button'
import { usePathname } from 'next/navigation'

interface FollowButtonProps {
  authorId: string
}

export function FollowButton({ authorId }: FollowButtonProps) {
  const pathname = usePathname()
  const { user, token, loading: authLoading } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user || !token) {
      setIsFollowing(false)
      return
    }

    fetch(`/api/follows/${authorId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setIsFollowing(data.isFollowing))
      .catch(() => {})
  }, [authorId, user, token, authLoading])

  const toggleFollow = useCallback(async () => {
    if (!user || !token) {
      window.location.href = `/signin?next=${encodeURIComponent(pathname)}`
      return
    }
    setLoading(true)
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

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
  }, [authorId, isFollowing, user, token, pathname])

  if (authLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        ...
      </Button>
    )
  }

  if (!user) {
    return (
      <a href={`/signin?next=${encodeURIComponent(pathname)}`}>
        <Button variant="outline" size="sm">
          Follow
        </Button>
      </a>
    )
  }

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

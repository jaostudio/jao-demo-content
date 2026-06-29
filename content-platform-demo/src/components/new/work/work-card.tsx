'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card } from '../ui/card'
import { Avatar } from '../ui/avatar'
import { ProvenanceBadge } from '@/components/provenance-badge'
import { WorkPoster } from './work-poster'
import { Heart, MessageCircle, Share2, Clock } from 'lucide-react'
import { toast } from 'sonner'

export type WorkCardVariant = 'feed' | 'featured' | 'compact' | 'mosaic' | 'studio'

interface WorkCardProps {
  title: string
  slug: string
  excerpt: string | null
  authorName: string
  categoryName: string
  readingTime: number
  commentCount: number
  variant?: WorkCardVariant
  image?: string | null
  format?: string
  aiFreeDeclaration?: boolean
  provenanceStatus?: string
  publishAt: Date | string | null
  articleId?: string
}

function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function WorkCard({
  title, slug, excerpt, authorName, categoryName,
  readingTime, commentCount, image, format, aiFreeDeclaration, provenanceStatus, publishAt, variant = 'feed', articleId,
}: WorkCardProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState<number | null>(null)
  const [liking, setLiking] = useState(false)

  useEffect(() => {
    if (!articleId) return
    try {
      const stored = localStorage.getItem(`liked:${articleId}`)
      if (stored === 'true') setLiked(true)
    } catch { /* noop */ }
  }, [articleId])

  const handleLike = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!articleId || liking) return
    setLiking(true)
    const action = liked ? 'unlike' : 'like'
    try {
      const res = await fetch(`/api/articles/${articleId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      if (data.likes !== undefined) {
        setLikeCount(data.likes)
        setLiked(!liked)
        try { localStorage.setItem(`liked:${articleId}`, String(!liked)) } catch { /* noop */ }
      }
    } catch { /* noop */ }
    setLiking(false)
  }, [articleId, liked, liking])

  const handleShare = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    const url = `${window.location.origin}/work/${slug}`
    try {
      await navigator.clipboard.writeText(url)
      toast('Link copied', { description: 'Work link copied to clipboard.' })
    } catch {
      toast('Could not copy', { description: 'Manually copy the URL from the address bar.' })
    }
  }, [slug])

  return (
    <Link href={`/work/${slug}`} className="block group">
      <Card className={`overflow-hidden transition-all duration-220 ease-out group-hover:-translate-y-1 group-hover:border-border-hover ${variant === 'featured' ? 'border-reactor-green/20' : ''}`}>
        {/* Creator Header */}
        <div className="flex items-center gap-2.5 px-4 py-3">
          <Avatar name={authorName} size="md" />
          <span className="text-[13px] font-medium text-text-primary">{authorName}</span>
          <span className="text-[12px] text-fog-gray">&middot;</span>
          <span className="text-[12px] text-fog-gray">{publishAt ? timeAgo(publishAt) : ''}</span>
        </div>

        {/* Media */}
        {image ? (
          <div className={`relative w-full overflow-hidden ${variant === 'featured' ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
        ) : (
          <WorkPoster
            title={title}
            authorName={authorName}
            category={categoryName}
            provenanceStatus={provenanceStatus}
            variant={variant === 'featured' ? 'featured' : variant === 'compact' || variant === 'mosaic' ? 'compact' : 'feed'}
          />
        )}

        {/* Content */}
        <div className="px-4 py-2">
          <h3 className="text-[15px] font-medium text-text-primary leading-snug line-clamp-2" style={{ letterSpacing: '-0.02em' }}>
            {title}
          </h3>
          {excerpt && variant !== 'compact' && (
            <p className="mt-1 text-[13px] text-graphite line-clamp-2">{excerpt}</p>
          )}
        </div>

        {/* Provenance Badge */}
        <div className="px-4 pt-1">
          <span className="inline-flex items-center gap-1.5">
            {aiFreeDeclaration && <ProvenanceBadge status="DECLARED_HUMAN_MADE" />}
            {provenanceStatus && provenanceStatus !== 'UNDECLARED' && provenanceStatus !== 'DECLARED_HUMAN_MADE' && (
              <ProvenanceBadge status={provenanceStatus} />
            )}
          </span>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-3 px-4 pb-3 pt-2">
          <div className="flex items-center gap-3 text-graphite">
            <button
              onClick={handleLike}
              disabled={liking}
              className={`flex items-center gap-1 transition-colors ${liked ? 'text-voltage-pink' : 'hover:text-text-primary'}`}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-voltage-pink' : ''}`} strokeWidth={liked ? 2 : 1.5} />
              {likeCount !== null && likeCount > 0 && <span className="text-[12px]">{likeCount}</span>}
            </button>
            <Link
              href={`/work/${slug}#comments`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 hover:text-text-primary transition-colors"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
              {commentCount > 0 && <span className="text-[12px]">{commentCount}</span>}
            </Link>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 hover:text-text-primary transition-colors"
            >
              <Share2 className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-[12px] text-fog-gray">
            <Clock className="h-3 w-3" strokeWidth={1.5} />
            {readingTime} min
          </div>
        </div>
      </Card>
    </Link>
  )
}

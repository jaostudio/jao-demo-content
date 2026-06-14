'use client'

import Link from 'next/link'
import { Card } from '../ui/card'
import { Avatar } from '../ui/avatar'
import { Heart, MessageCircle, Share2, Clock } from 'lucide-react'

interface ArticleCardProps {
  title: string
  slug: string
  excerpt: string | null
  authorName: string
  categoryName: string
  readingTime: number
  commentCount: number
  isFeatured?: boolean
  image?: string | null
  format?: string
  aiFreeDeclaration?: boolean
  publishAt: Date | string | null
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

export function ArticleCard({
  title, slug, excerpt, authorName, categoryName,
  readingTime, commentCount, image, format, publishAt,
}: ArticleCardProps) {
  return (
    <Link href={`/articles/${slug}`} className="block group">
      <Card className="overflow-hidden">
        {/* Creator Header */}
        <div className="flex items-center gap-2.5 px-4 py-3">
          <Avatar name={authorName} size="md" />
          <span className="text-[14px] font-medium text-text-primary">{authorName}</span>
          <span className="text-[12px] text-fog-gray">&middot;</span>
          <span className="text-[12px] text-fog-gray">{publishAt ? timeAgo(publishAt) : ''}</span>
        </div>

        {/* Media */}
        {image && (
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div className="px-4 py-2">
          <h3 className="text-[17px] font-medium text-text-primary leading-snug line-clamp-2">
            {title}
          </h3>
          {excerpt && (
            <p className="mt-1 text-[14px] text-graphite line-clamp-2">{excerpt}</p>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-3 px-4 pb-3 pt-2">
          <div className="flex items-center gap-3 text-graphite">
            <button className="flex items-center gap-1 hover:text-text-primary transition-colors" onClick={(e) => e.preventDefault()}>
              <Heart className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button className="flex items-center gap-1 hover:text-text-primary transition-colors" onClick={(e) => e.preventDefault()}>
              <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
              {commentCount > 0 && <span className="text-[12px]">{commentCount}</span>}
            </button>
            <button className="flex items-center gap-1 hover:text-text-primary transition-colors" onClick={(e) => e.preventDefault()}>
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

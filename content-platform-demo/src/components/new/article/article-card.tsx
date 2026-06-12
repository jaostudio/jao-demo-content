import Link from 'next/link'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Avatar } from '../ui/avatar'
import { MessageSquare, Clock } from 'lucide-react'

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
  publishAt: Date | string | null
}

function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function ArticleCard({
  title, slug, excerpt, authorName, categoryName,
  readingTime, commentCount, isFeatured, image, publishAt,
}: ArticleCardProps) {
  if (isFeatured) {
    return (
      <Link href={`/articles/${slug}`} className="block group">
        <Card className="overflow-hidden">
          {image && (
            <div className="relative h-48 w-full overflow-hidden bg-surface-alt">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          )}
          <div className="p-5">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="primary">{categoryName}</Badge>
            </div>
            <h2 className="mb-2 text-xl font-display font-bold text-text-primary group-hover:text-primary transition-colors leading-tight">
              {title}
            </h2>
            {excerpt && (
              <p className="mb-3 text-sm text-text-secondary leading-relaxed line-clamp-2">{excerpt}</p>
            )}
            <div className="flex items-center gap-3 text-xs text-text-muted">
              <div className="flex items-center gap-1.5">
                <Avatar name={authorName} size="sm" />
                <span className="text-text-secondary font-medium">{authorName}</span>
              </div>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readingTime} min
              </span>
              {publishAt && (
                <>
                  <span>·</span>
                  <span>{timeAgo(publishAt)}</span>
                </>
              )}
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/articles/${slug}`} className="block group">
      <Card className="p-4 flex gap-4">
          {image && (
            <div className="hidden sm:block w-24 h-24 shrink-0 overflow-hidden rounded-md bg-surface-alt">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={title} className="h-full w-full object-cover" loading="lazy" />
            </div>
          )}
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <Badge variant="primary">{categoryName}</Badge>
          </div>
          <h3 className="mb-1 text-sm font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          {excerpt && (
            <p className="mb-2 text-xs text-text-secondary line-clamp-1">{excerpt}</p>
          )}
          <div className="flex items-center gap-2 text-[11px] text-text-muted">
            <span className="font-medium text-text-secondary">{authorName}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readingTime} min
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {commentCount}
            </span>
            {publishAt && (
              <>
                <span>·</span>
                <span>{timeAgo(publishAt)}</span>
              </>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}

import Link from 'next/link'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Avatar } from '../ui/avatar'
import { MessageSquare, Clock, Image, PenLine, Video, Music } from 'lucide-react'
import { AiFreeBadge } from './ai-free-badge'

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

const FORMAT_ICONS: Record<string, typeof Image> = {
  DRAWING: Image,
  WRITING: PenLine,
  VIDEO: Video,
  AUDIO: Music,
}

const FORMAT_LABELS: Record<string, string> = {
  DRAWING: 'Drawing',
  WRITING: 'Writing',
  VIDEO: 'Video',
  AUDIO: 'Audio',
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
  readingTime, commentCount, isFeatured, image, format, aiFreeDeclaration, publishAt,
}: ArticleCardProps) {
  const FormatIcon = format ? FORMAT_ICONS[format] : null

  if (isFeatured) {
    return (
      <Link href={`/articles/${slug}`} className="block">
        <Card className="overflow-hidden">
          {image && (
            <div className="relative aspect-[2/1] w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          <div className="p-4">
            <div className="mb-2 flex items-center gap-1.5">
              <Badge variant="default">{categoryName}</Badge>
              {format && FormatIcon && (
                <span className="inline-flex items-center gap-1 rounded bg-surface-alt px-1.5 py-0.5 text-[9px] font-medium text-text-secondary leading-none">
                  <FormatIcon className="h-2.5 w-2.5" />
                  {FORMAT_LABELS[format]}
                </span>
              )}
              {aiFreeDeclaration && <AiFreeBadge />}
            </div>
            <h2 className="mb-1.5 text-lg font-display font-bold text-text-primary leading-snug">
              {title}
            </h2>
            {excerpt && (
              <p className="mb-3 text-xs text-text-secondary leading-relaxed line-clamp-2">{excerpt}</p>
            )}
            <div className="flex items-center gap-3 text-[11px] text-text-muted">
              <div className="flex items-center gap-1.5">
                <Avatar name={authorName} size="sm" />
                <span className="text-text-secondary font-medium">{authorName}</span>
              </div>
              <span>&middot;</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readingTime} min
              </span>
              {publishAt && (
                <>
                  <span>&middot;</span>
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
    <Link href={`/articles/${slug}`} className="block">
      <Card className="p-3 flex gap-3">
          {image && (
            <div className="hidden sm:block w-20 h-20 shrink-0 overflow-hidden rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={title} className="h-full w-full object-cover" loading="lazy" />
            </div>
          )}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-1.5">
            <Badge variant="default">{categoryName}</Badge>
            {format && FormatIcon && (
              <span className="inline-flex items-center gap-1 rounded bg-surface-alt px-1.5 py-0.5 text-[9px] font-medium text-text-secondary leading-none">
                <FormatIcon className="h-2.5 w-2.5" />
                {FORMAT_LABELS[format]}
              </span>
            )}
            {aiFreeDeclaration && <AiFreeBadge />}
          </div>
          <h3 className="mb-0.5 text-sm font-semibold text-text-primary line-clamp-2">
            {title}
          </h3>
          {excerpt && (
            <p className="mb-1.5 text-[11px] text-text-secondary line-clamp-1">{excerpt}</p>
          )}
          <div className="flex items-center gap-2 text-[10px] text-text-muted">
            <span className="font-medium text-text-secondary">{authorName}</span>
            <span>&middot;</span>
            <span className="flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              {readingTime} min
            </span>
            <span>&middot;</span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-2.5 w-2.5" />
              {commentCount}
            </span>
            {publishAt && (
              <>
                <span>&middot;</span>
                <span>{timeAgo(publishAt)}</span>
              </>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}

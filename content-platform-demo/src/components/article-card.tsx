import Link from 'next/link'
import Image from 'next/image'
import { CategoryBadge } from '@/components/category-badge'
import { MessageSquare } from 'lucide-react'

interface ArticleCardProps {
  title: string
  slug: string
  excerpt: string | null
  authorName: string
  categorySlug: string
  categoryName: string
  publishAt: string | null
  tags: { name: string; slug: string }[]
  image?: string | null
  content?: string | null
  variant?: 'featured' | 'standard'
  commentCount?: number
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const seconds = Math.floor((now - then) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

export function ArticleCard({ title, slug, excerpt, authorName, categorySlug, categoryName, publishAt, image, content, variant = 'standard', commentCount = 0 }: ArticleCardProps) {
  const readingTime = content ? Math.ceil(content.split(/\s+/).length / 200) : null

  if (variant === 'featured') {
    return (
      <article className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md dark:border-border-dark dark:bg-card-dark">
        {image && (
          <div className="overflow-hidden">
            <Image src={image} alt={title} width={800} height={200} className="h-48 w-full object-cover transition-transform group-hover:scale-105" />
          </div>
        )}
        <div className="p-4">
          <div className="mb-2 flex items-center gap-2 text-xs text-text-secondary">
            <CategoryBadge slug={categorySlug} name={categoryName} />
            <span>·</span>
            <span>{authorName}</span>
            {publishAt && <><span>·</span><span>{timeAgo(publishAt)}</span></>}
          </div>
          <Link href={`/articles/${slug}`}>
            <h2 className="mb-1 text-lg font-semibold text-text-primary transition-colors group-hover:text-primary dark:text-slate-100">{title}</h2>
          </Link>
          {excerpt && <p className="mb-3 text-sm text-text-secondary line-clamp-2">{excerpt}</p>}
          <div className="flex items-center gap-4 text-xs text-text-muted">
            {readingTime && <span>{readingTime} min read</span>}
            <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />{commentCount}</span>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group flex gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:shadow-md dark:border-border-dark dark:bg-card-dark">
      {image && (
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
          <Image src={image} alt={title} width={64} height={64} className="h-full w-full object-cover" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2 text-[11px] text-text-muted">
          <CategoryBadge slug={categorySlug} name={categoryName} />
          <span>·</span>
          <span>{authorName}</span>
          {publishAt && <><span>·</span><span>{timeAgo(publishAt)}</span></>}
        </div>
        <Link href={`/articles/${slug}`}>
          <h3 className="text-sm font-semibold text-text-primary transition-colors group-hover:text-primary dark:text-slate-100 line-clamp-1">{title}</h3>
        </Link>
        {excerpt && <p className="mt-0.5 text-xs text-text-secondary line-clamp-1">{excerpt}</p>}
        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-text-muted">
          {readingTime && <span>{readingTime} min read</span>}
          <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{commentCount}</span>
        </div>
      </div>
    </article>
  )
}

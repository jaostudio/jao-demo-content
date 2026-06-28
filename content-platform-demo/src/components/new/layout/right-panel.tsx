'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Avatar } from '../ui/avatar'
import { FollowButton } from '@/components/follow-button'

interface AuthorEntry {
  id: string
  name: string
  role: string
  username?: string
}

interface SuggestedFollowsPanelProps {
  categories: { slug: string; name: string }[]
  trending?: { slug: string; title: string; commentCount: number }[]
  suggestedAuthors?: AuthorEntry[]
}

export function RightPanel({ categories, trending = [], suggestedAuthors = [] }: SuggestedFollowsPanelProps) {
  const t = useTranslations('common')

  return (
    <aside className="space-y-6">
      {/* Featured Artists */}
      {suggestedAuthors.length > 0 && (
        <div>
          <h3 className="mb-3 text-[14px] font-semibold text-text-primary">Featured Artists</h3>
          <div className="space-y-4">
            {suggestedAuthors.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <Link href={user.username ? `/artist/${user.username}` : '#'} className="shrink-0">
                  <Avatar name={user.name} size="md" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={user.username ? `/artist/${user.username}` : '#'}>
                    <p className="text-[14px] font-medium text-text-primary truncate">{user.name}</p>
                  </Link>
                  <p className="text-[12px] text-graphite">{user.role}</p>
                </div>
                <FollowButton authorId={user.id} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div>
        <h3 className="mb-3 text-[14px] font-semibold text-text-primary">Discover Categories</h3>
        <div className="space-y-px">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="flex items-center justify-between rounded px-2.5 py-2 text-[14px] text-graphite hover:bg-surface-alt hover:text-text-primary transition-colors"
            >
              <span>{cat.name}</span>
              <span className="text-ash">&rarr;</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending */}
      {trending.length > 0 && (
        <div>
          <h3 className="mb-3 text-[14px] font-semibold text-accent">Trending</h3>
          <div className="space-y-px">
            {trending.map((item, i) => (
              <Link
                key={item.slug}
                href={`/articles/${item.slug}`}
                className="flex items-start gap-2.5 rounded px-2.5 py-2 hover:bg-surface-alt transition-colors"
              >
                <span className="mt-0.5 text-[12px] font-medium text-ash shrink-0">{i + 1}</span>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-text-primary line-clamp-2">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[12px] text-fog-gray">{item.commentCount} conversations</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Footer links */}
      <div className="border-t border-hairline pt-4">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-fog-gray">
          <Link href="/" className="hover:text-graphite transition-colors">Home</Link>
          <Link href="/category" className="hover:text-graphite transition-colors">Categories</Link>
          <Link href="/rss.xml" className="hover:text-graphite transition-colors">RSS</Link>
        </div>
        <p className="mt-2 text-[12px] text-ash">&copy; {new Date().getFullYear()} Likha</p>
      </div>
    </aside>
  )
}

'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Avatar } from '../ui/avatar'
import { Button } from '../ui/button'

interface SuggestedFollowsPanelProps {
  categories: { slug: string; name: string }[]
  trending?: { slug: string; title: string; commentCount: number }[]
}

export function RightPanel({ categories, trending = [] }: SuggestedFollowsPanelProps) {
  const t = useTranslations('common')

  return (
    <aside className="space-y-6">
      {/* Suggested Follows */}
      <div>
        <h3 className="mb-3 text-[14px] font-semibold text-text-primary">Suggested follows</h3>
        <div className="space-y-4">
          {[
            { name: 'Sarah Chen', role: 'Writer' },
            { name: 'Marcus Rivera', role: 'Creator' },
            { name: 'Likha Editorial', role: 'Curator' },
          ].map((user) => (
            <div key={user.name} className="flex items-center gap-3">
              <Avatar name={user.name} size="md" />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium text-text-primary truncate">{user.name}</p>
                <p className="text-[12px] text-graphite">{user.role}</p>
              </div>
              <Button variant="dark" size="sm" className="shrink-0 rounded-full px-3 py-1 text-[11px]">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="mb-3 text-[14px] font-semibold text-text-primary">Explore</h3>
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
                  <p className="mt-0.5 text-[12px] text-fog-gray">{item.commentCount} comments</p>
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

'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { TrendingUp, Hash } from 'lucide-react'

interface SidebarProps {
  categories: { slug: string; name: string }[]
  totalArticles?: number
  totalAuthors?: number
  totalComments?: number
  trending?: { slug: string; title: string; commentCount: number }[]
}

export function Sidebar({ categories, totalArticles = 0, totalAuthors = 0, totalComments = 0, trending = [] }: SidebarProps) {
  const t = useTranslations('common')

  return (
    <aside className="space-y-3">
      {/* About Likha */}
      <Card className="p-0 overflow-hidden">
        <div className="bg-primary px-4 py-2.5">
          <h3 className="text-xs font-display font-bold text-white tracking-wide">About Likha</h3>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-xs text-text-secondary leading-relaxed">
            {t('hero_subtitle')}
          </p>
          <div className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
            <div>
              <p className="text-sm font-bold text-text-primary">{totalArticles}</p>
              <p className="text-[10px] text-text-muted">Articles</p>
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">{totalAuthors}</p>
              <p className="text-[10px] text-text-muted">Authors</p>
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">{totalComments}</p>
              <p className="text-[10px] text-text-muted">Comments</p>
            </div>
          </div>
          <Link href="/register" className="block">
            <Button variant="secondary" size="sm" className="w-full">
              Join Likha
            </Button>
          </Link>
        </div>
      </Card>

      {/* Popular Categories */}
      <Card className="p-4">
        <h3 className="mb-3 flex items-center gap-1.5 text-xs font-display font-bold text-text-primary">
          <Hash className="h-3.5 w-3.5 text-primary" />
          Popular Categories
        </h3>
        <div className="space-y-0.5">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="flex items-center justify-between rounded px-2 py-1.5 text-xs text-text-secondary hover:bg-primary-light hover:text-primary transition-colors"
            >
              <span>{cat.name}</span>
              <span className="text-text-muted">&rarr;</span>
            </Link>
          ))}
        </div>
      </Card>

      {/* Trending */}
      {trending.length > 0 && (
        <Card className="p-4">
          <h3 className="mb-3 flex items-center gap-1.5 text-xs font-display font-bold text-text-primary">
            <TrendingUp className="h-3.5 w-3.5 text-accent" />
            Trending
          </h3>
          <div className="space-y-0">
            {trending.map((item, i) => (
              <Link
                key={item.slug}
                href={`/articles/${item.slug}`}
                className="flex items-start gap-2 rounded px-2 py-1.5 hover:bg-primary-light transition-colors group"
              >
                <span className="mt-0.5 text-[10px] font-bold text-text-muted shrink-0">{i + 1}</span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-text-primary group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-text-muted">{item.commentCount} comments</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </aside>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
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

const DEMO_USERS = [
  { email: 'sarah@content.dev', label: 'Sign in as Author', role: 'Author' },
  { email: 'admin@content.dev', label: 'Sign in as Admin', role: 'Admin' },
]

export function RightPanel({ categories, trending = [], suggestedAuthors = [] }: SuggestedFollowsPanelProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const showDemo = typeof window !== 'undefined' || true

  return (
    <aside className="space-y-6">
      {/* Demo Access Card (desktop, not on /signin) */}
      {!user && pathname !== '/signin' && (
        <div className="relative overflow-hidden rounded-xl border border-hairline bg-card p-4">
          <div className="pointer-events-none absolute right-0 top-0 h-12 w-12 opacity-[0.15]">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-voltage-pink)" strokeWidth="1">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="absolute right-0 top-0 h-8 w-8 rounded-bl-xl border-b border-l border-voltage-pink/30" />
          <h3 className="text-[13px] font-semibold text-text-primary mb-1">Demo Access</h3>
          <p className="text-[11px] text-fog-gray mb-3">Try Likha as an Artist or Admin.</p>
          <div className="space-y-1.5">
            {DEMO_USERS.map((demo) => (
              <Link
                key={demo.email}
                href={`/signin?email=${encodeURIComponent(demo.email)}`}
                className="flex items-center justify-between rounded-lg border border-hairline px-3 py-2 text-[12px] hover:border-reactor-green/40 hover:bg-surface-alt transition-all"
              >
                <span className="text-graphite">{demo.email}</span>
                <span className="font-medium text-reactor-green">{demo.label}</span>
              </Link>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-ash">Password: <span className="font-medium text-graphite">password123</span></p>
        </div>
      )}

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
                href={`/work/${item.slug}`}
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

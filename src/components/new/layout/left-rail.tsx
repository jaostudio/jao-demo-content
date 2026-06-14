'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Home, Search, PenLine, TrendingUp, Menu } from 'lucide-react'
import { Avatar } from '../ui/avatar'
import { useState } from 'react'
import { MobileDrawer } from './mobile-drawer'

const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/trending', icon: TrendingUp, label: 'Trending' },
]

export function LeftRail() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <nav className="fixed left-0 top-0 z-50 hidden lg:flex h-screen w-[68px] flex-col items-center bg-surface dark:bg-surface-dark border-r border-hairline dark:border-border-dark py-6">
        {/* Logo */}
        <Link href="/" className="mb-6 flex items-center justify-center">
          <span className="text-2xl font-bold text-text-primary tracking-tight">L</span>
        </Link>

        {/* Nav Icons */}
        <div className="flex flex-1 flex-col items-center gap-6">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className="group relative flex items-center justify-center"
                title={label}
              >
                <Icon
                  className={`h-7 w-7 transition-colors ${
                    isActive ? 'text-text-primary' : 'text-graphite group-hover:text-text-primary'
                  }`}
                  strokeWidth={isActive ? 2 : 1.5}
                />
              </Link>
            )
          })}

          {session?.user && (
            <Link
              href="/admin/articles/new"
              className="group flex items-center justify-center"
              title="Create"
            >
              <PenLine
                className="h-7 w-7 text-graphite group-hover:text-text-primary transition-colors"
                strokeWidth={1.5}
              />
            </Link>
          )}
        </div>

        {/* Bottom: Avatar or Hamburger */}
        <div className="flex flex-col items-center gap-4">
          {session?.user ? (
            <Link href="/admin" title="Profile">
              <Avatar name={session.user.name || 'U'} size="sm" />
            </Link>
          ) : (
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center justify-center"
              aria-label="Menu"
            >
              <Menu className="h-7 w-7 text-graphite hover:text-text-primary transition-colors" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </nav>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}

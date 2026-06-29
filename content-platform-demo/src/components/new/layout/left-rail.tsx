'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, PenLine, TrendingUp, Compass, Menu, Shield } from 'lucide-react'
import { Avatar } from '../ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { useDemoRoleStore } from '@/store/demo-role-store'
import { useState } from 'react'
import { MobileDrawer } from './mobile-drawer'
import { MobileBottomNav } from './mobile-bottom-nav'

const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/explore', icon: Compass, label: 'Explore' },
  { href: '/trending', icon: TrendingUp, label: 'Trending' },
  { href: '/search', icon: Search, label: 'Search' },
]

export function LeftRail() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { role: demoRole } = useDemoRoleStore()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const isAdmin = user?.role === 'ADMIN'
  const effectiveRole = user?.role || demoRole

  return (
    <>
      <nav className="fixed left-0 top-0 z-50 hidden lg:flex h-screen w-[68px] flex-col items-center bg-surface dark:bg-surface-dark border-r border-hairline dark:border-border-dark py-6 safe-top">
        {/* Logo */}
        <Link href="/" className="mb-6 flex items-center justify-center">
          <span className="text-2xl font-bold text-text-primary tracking-tight hover:text-reactor-green transition-colors">L</span>
        </Link>

        {/* Nav Icons */}
        <div className="flex flex-1 flex-col items-center gap-5">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className="group relative flex items-center justify-center"
                title={label}
              >
                {isActive && (
                  <span className="absolute -left-4 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-reactor-green transition-all" />
                )}
                <Icon
                  className={`h-6 w-6 transition-all duration-220 ${
                    isActive
                      ? 'text-reactor-green scale-110'
                      : 'text-graphite group-hover:text-text-primary group-hover:scale-110'
                  }`}
                  strokeWidth={isActive ? 2 : 1.5}
                />
              </Link>
            )
          })}

          {/* Create — green emphasis */}
          {(user || effectiveRole === 'AUTHOR' || effectiveRole === 'ADMIN') && (
            <Link
              href="/admin/articles/new"
              className="group relative flex items-center justify-center"
              title="Create"
            >
              <div className="absolute inset-0 rounded-full bg-reactor-green/10 group-hover:bg-reactor-green/20 transition-colors" />
              <PenLine
                className="relative h-5 w-5 text-reactor-green group-hover:scale-110 transition-all"
                strokeWidth={2}
              />
            </Link>
          )}
        </div>

        {/* Bottom section */}
        <div className="flex flex-col items-center gap-3">
          {/* Admin link — separated */}
          {isAdmin && (
            <Link
              href="/admin"
              className="group relative flex items-center justify-center"
              title="Admin"
            >
              <Shield
                className={`h-5 w-5 transition-all ${
                  pathname.startsWith('/admin') ? 'text-voltage-pink scale-110' : 'text-fog-gray group-hover:text-text-primary group-hover:scale-110'
                }`}
                strokeWidth={pathname.startsWith('/admin') ? 2 : 1.5}
              />
            </Link>
          )}

          {/* Avatar or Hamburger */}
          {user ? (
            <Link href="/admin" title="Profile">
              <div className="group">
                <Avatar name={user.name || 'U'} size="sm" />
              </div>
            </Link>
          ) : (
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center justify-center group"
              aria-label="Menu"
            >
              <Menu className="h-6 w-6 text-graphite group-hover:text-text-primary group-hover:scale-110 transition-all" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </nav>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <MobileBottomNav />
    </>
  )
}

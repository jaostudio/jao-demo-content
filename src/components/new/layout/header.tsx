'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Search, PenLine, Menu } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { Avatar } from '../ui/avatar'
import { Button } from '../ui/button'
import { useEffectiveRole } from '@/hooks/use-effective-role'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileDrawer } from './mobile-drawer'

export function Header() {
  const { data: session } = useSession()
  const { role: effectiveRole } = useEffectiveRole()
  const t = useTranslations('common')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const showAuthorActions = effectiveRole === 'ADMIN' || effectiveRole === 'AUTHOR'

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-hairline dark:border-border-dark bg-surface dark:bg-surface-dark">
      <div className="flex h-[80px] items-center justify-between px-6">
        {/* Left: Hamburger (mobile only) */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center justify-center lg:hidden"
          aria-label="Menu"
        >
          <Menu className="h-7 w-7 text-graphite hover:text-text-primary transition-colors" strokeWidth={1.5} />
        </button>

        {/* Center: Search */}
        <div className="flex flex-1 justify-center">
          <form onSubmit={handleSearch} className="relative w-full max-w-[520px]">
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-fog-gray" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder') || 'Search'}
              className="h-10 w-full rounded-lg bg-surface dark:bg-surface-dark border border-hairline dark:border-border-dark pl-11 pr-4 text-[14px] text-text-primary placeholder:text-fog-gray focus:outline-none focus:ring-2 focus:ring-border-focus/20 transition-colors"
            />
          </form>
        </div>

        {/* Right: Auth */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LocaleSwitcher />
          {showAuthorActions ? (
            <>
              {effectiveRole === 'ADMIN' && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm">{t('admin')}</Button>
                </Link>
              )}
              <Link href="/admin/articles/new">
                <Button variant="dark" size="sm">
                  <PenLine className="h-4 w-4" />
                </Button>
              </Link>
              {session?.user && (
                <Avatar name={session.user.name || 'U'} size="sm" />
              )}
            </>
          ) : (
            <Link href="/signin">
              <Button variant="ghost" size="sm">{t('sign_in')}</Button>
            </Link>
          )}
        </div>
      </div>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  )
}

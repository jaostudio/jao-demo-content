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
import { MobileDrawer } from './mobile-drawer'

export function Header() {
  const { data: session } = useSession()
  const { role: effectiveRole } = useEffectiveRole()
  const t = useTranslations('common')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const showAuthorActions = effectiveRole === 'ADMIN' || effectiveRole === 'AUTHOR'

  return (
    <header className="sticky top-0 z-30 bg-surface dark:bg-surface-dark">
      <div className="flex h-14 items-center justify-between px-5">
        {/* Left: Hamburger (mobile only) */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center justify-center lg:hidden"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5 text-graphite hover:text-text-primary transition-colors" strokeWidth={1.5} />
        </button>

        {/* Center: Search */}
        <div className="flex flex-1 justify-center">
          <div className="relative w-full max-w-[520px]">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fog-gray" />
            <input
              type="search"
              placeholder={t('search_placeholder') || 'Search'}
              className="h-10 w-full rounded-lg bg-surface-alt dark:bg-surface-dark pl-10 pr-4 text-[14px] text-text-primary placeholder:text-fog-gray focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Right: Auth */}
        <div className="flex items-center gap-2">
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
                  <PenLine className="h-3 w-3" />
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

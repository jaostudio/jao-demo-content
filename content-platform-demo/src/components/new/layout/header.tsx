'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Search, Menu, PenLine } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { Avatar } from '../ui/avatar'
import { Button } from '../ui/button'
import { useEffectiveRole } from '@/hooks/use-effective-role'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession()
  const { role: effectiveRole } = useEffectiveRole()
  const t = useTranslations('common')

  const showAuthorActions = effectiveRole === 'ADMIN' || effectiveRole === 'AUTHOR'

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="container-likha flex h-12 items-center justify-between gap-2">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="btn btn-ghost btn-sm lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-base font-semibold text-text-primary">
              Likha
            </span>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              placeholder={t('search_placeholder') || 'Search kwento...'}
              className="input h-8 rounded-lg pl-8 text-xs"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LocaleSwitcher />
          {showAuthorActions ? (
            <div className="flex items-center gap-1.5">
              {effectiveRole === 'ADMIN' && (
                <Link href="/admin">
                  <Button variant="dark" size="sm">{t('admin')}</Button>
                </Link>
              )}
              <Link href="/admin/articles/new">
                <Button variant="dark" size="sm">
                  <PenLine className="h-3 w-3" />
                  <span className="hidden md:inline">{t('new_article')}</span>
                </Button>
              </Link>
              {session?.user && (
                <Avatar name={session.user.name || 'U'} size="sm" />
              )}
            </div>
          ) : (
            <Link href="/signin">
              <Button variant="ghost" size="sm">{t('sign_in')}</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

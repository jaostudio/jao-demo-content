'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Search, PenLine } from 'lucide-react'
import { MobileDrawer } from '@/components/ui/mobile-drawer'
import { ThemeToggle } from '@/components/theme-toggle'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { useEffectiveRole } from '@/hooks/use-effective-role'
import { useAuth } from '@/hooks/useAuth'

const avatarColors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-rose-500', 'bg-violet-500']

function getAvatarColor(name: string) {
  const index = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return avatarColors[index % avatarColors.length]
}

export function Header() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const { role: effectiveRole } = useEffectiveRole()
  const isAuthenticated = effectiveRole === 'ADMIN' || effectiveRole === 'AUTHOR'
  const t = useTranslations('common')
  const [confirmingSignOut, setConfirmingSignOut] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm dark:border-border-dark dark:bg-card-dark">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {(pathname.startsWith('/admin') || pathname.startsWith('/articles') || pathname.startsWith('/category')) && (
            <MobileDrawer />
          )}
          <Link href="/" className="text-lg font-bold tracking-tight text-primary">
            {t('site_name')}
          </Link>
        </div>
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/search"
            className="rounded-full p-2 text-text-secondary transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Link>
          <LocaleSwitcher />
          <ThemeToggle />
          {isAuthenticated && (
            <Link
              href="/admin/articles/new"
              className="hidden items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-hover sm:inline-flex"
            >
              <PenLine className="h-3 w-3" />
              {t('new_article')}
            </Link>
          )}
          {user ? (
            <>
              <button
                onClick={() => setConfirmingSignOut(true)}
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${getAvatarColor(user.name ?? 'U')}`}
                aria-label="Sign out"
              >
                {(user.name ?? 'U').charAt(0).toUpperCase()}
              </button>
              {confirmingSignOut && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setConfirmingSignOut(false)}>
                  <div className="mx-4 w-full max-w-sm rounded-xl bg-card p-6 shadow-xl dark:bg-card-dark" onClick={(e) => e.stopPropagation()}>
                    <p className="mb-4 text-sm text-text-body">Are you sure you want to sign out?</p>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setConfirmingSignOut(false)} className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-text-body hover:bg-slate-50 dark:border-border-dark dark:hover:bg-slate-700">Cancel</button>
                      <button onClick={() => signOut()} className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-hover">Sign Out</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Link href="/signin" className="text-sm font-medium text-text-secondary hover:text-primary">{t('sign_in')}</Link>
          )}
        </nav>
      </div>
    </header>
  )
}

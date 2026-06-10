'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Search, PenLine } from 'lucide-react'
import { MobileDrawer } from '@/components/ui/mobile-drawer'
import { ThemeToggle } from '@/components/theme-toggle'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { useEffectiveRole } from '@/hooks/use-effective-role'

const avatarColors = ['bg-saffron-500', 'bg-indigo-deep-600', 'bg-coral-400', 'bg-cat-tech', 'bg-saffron-700']

function getAvatarColor(name: string) {
  const index = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return avatarColors[index % avatarColors.length]
}

export function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const { role: effectiveRole } = useEffectiveRole()
  const isAuthenticated = effectiveRole === 'ADMIN' || effectiveRole === 'AUTHOR'
  const t = useTranslations('common')
  const [confirmingSignOut, setConfirmingSignOut] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b-2 border-black bg-cream dark:border-white dark:bg-[#1A1A1A]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {(pathname.startsWith('/admin') || pathname.startsWith('/articles') || pathname.startsWith('/category')) && (
            <MobileDrawer />
          )}
          <Link href="/" className="font-display text-lg font-bold tracking-tight text-indigo-deep-800 dark:text-saffron-400">
            {t('site_name')}
          </Link>
        </div>
        <nav className="flex items-center gap-1 text-sm sm:gap-3">
          <Link
            href="/search"
            className="rounded-md p-2 text-neutral-500 transition-colors hover:bg-black/5 dark:text-neutral-400 dark:hover:bg-white/10"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Link>
          <LocaleSwitcher />
          <ThemeToggle />
          {isAuthenticated && (
            <Link
              href="/admin/articles/new"
              className="hidden items-center gap-1 rounded-none border-2 border-black bg-saffron-500 px-3 py-1.5 text-sm font-bold text-black nb-shadow transition-all hover:nb-shadow-lg dark:border-white dark:text-black sm:inline-flex"
            >
              <PenLine className="h-3.5 w-3.5" />
              {t('new_article')}
            </Link>
          )}
          {session?.user ? (
            <>
              <button
                onClick={() => setConfirmingSignOut(true)}
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-black text-xs font-bold text-white dark:border-white ${getAvatarColor((session.user as { name?: string }).name ?? 'U')}`}
                aria-label="Sign out"
              >
                {((session.user as { name?: string }).name ?? 'U').charAt(0).toUpperCase()}
              </button>
              {confirmingSignOut && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setConfirmingSignOut(false)}>
                  <div className="rounded-none border-2 border-black bg-cream p-6 nb-shadow-lg dark:border-white dark:bg-[#1A1A1A]" onClick={(e) => e.stopPropagation()}>
                    <p className="mb-4 text-sm text-neutral-700 dark:text-neutral-300">Are you sure you want to sign out?</p>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setConfirmingSignOut(false)} className="rounded-none border-2 border-black px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-black/5 dark:border-white dark:text-neutral-300">Cancel</button>
                      <button onClick={() => signOut()} className="rounded-none border-2 border-black bg-coral-400 px-3 py-1.5 text-sm font-bold text-black hover:bg-coral-500 dark:border-white">Sign Out</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Link href="/signin" className="text-sm font-bold text-neutral-700 hover:text-indigo-deep-600 dark:text-neutral-300 dark:hover:text-saffron-400">{t('sign_in')}</Link>
          )}
        </nav>
      </div>
    </header>
  )
}

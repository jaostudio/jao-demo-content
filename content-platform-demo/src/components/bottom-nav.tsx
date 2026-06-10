'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PenLine } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { useEffectiveRole } from '@/hooks/use-effective-role'

export function BottomNav() {
  const pathname = usePathname()
  const { role: effectiveRole } = useEffectiveRole()
  const showWrite = effectiveRole === 'ADMIN' || effectiveRole === 'AUTHOR'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t-2 border-black bg-cream dark:border-white dark:bg-[#1A1A1A] md:hidden">
      <div className="flex items-center justify-around px-4 pb-3 pt-2">
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 text-xs font-bold ${pathname === '/' ? 'text-saffron-600 dark:text-saffron-400' : 'text-neutral-500 dark:text-neutral-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" clipRule="evenodd" />
          </svg>
          <span>Home</span>
        </Link>
        <Link
          href="/category"
          className={`flex flex-col items-center gap-0.5 text-xs font-bold ${pathname.startsWith('/category') ? 'text-saffron-600 dark:text-saffron-400' : 'text-neutral-500 dark:text-neutral-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M2 3.75A.75.75 0 0 1 2.75 3h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-4.5Z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M2 11.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-4.5Z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M10 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-4.5Z" clipRule="evenodd" />
            <path d="M10.75 11.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-4.5Z" />
          </svg>
          <span>Categories</span>
        </Link>

        {showWrite ? (
          <Link
            href="/admin/articles/new"
            className="flex flex-col items-center gap-0.5 text-xs font-bold text-neutral-500 dark:text-neutral-400"
          >
            <div className="-mt-6 flex h-11 w-11 items-center justify-center rounded-full border-2 border-black bg-coral-400 text-black nb-shadow transition-all hover:nb-shadow-lg dark:border-white dark:text-black">
              <PenLine className="h-5 w-5" />
            </div>
            <span>Write</span>
          </Link>
        ) : (
          <div className="w-14" />
        )}

        <div className="flex flex-col items-center gap-0.5 text-xs font-bold text-neutral-500 dark:text-neutral-400">
          <ThemeToggle />
          <span>Theme</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 text-xs font-bold text-neutral-500 dark:text-neutral-400">
          <LocaleSwitcher />
          <span>Language</span>
        </div>
      </div>
    </nav>
  )
}

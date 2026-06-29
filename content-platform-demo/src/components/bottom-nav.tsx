'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PenLine } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { useEffectiveRole } from '@/hooks/use-effective-role'

export function BottomNav() {
  const pathname = usePathname()
  const { role: effectiveRole } = useEffectiveRole()
  const showWrite = effectiveRole === 'ADMIN' || effectiveRole === 'AUTHOR'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card dark:border-border-dark dark:bg-card-dark md:hidden">
      <div className="flex items-center justify-around px-4 pb-2 pt-1.5">
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${pathname === '/' ? 'text-primary' : 'text-text-muted'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" clipRule="evenodd" />
          </svg>
          <span>Home</span>
        </Link>
        <Link
          href="/category"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${pathname.startsWith('/category') ? 'text-primary' : 'text-text-muted'}`}
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
            className="flex flex-col items-center gap-0.5 text-[10px] font-medium text-text-muted"
          >
            <div className="-mt-5 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-md transition-colors hover:bg-primary-hover">
              <PenLine className="h-4 w-4" />
            </div>
            <span>Write</span>
          </Link>
        ) : (
          <div className="w-12" />
        )}

        <div className="flex flex-col items-center gap-0.5 text-[10px] font-medium text-text-muted">
          <ThemeToggle />
          <span>Theme</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 text-[10px] font-medium text-text-muted">
          <span>Language</span>
        </div>
      </div>
    </nav>
  )
}

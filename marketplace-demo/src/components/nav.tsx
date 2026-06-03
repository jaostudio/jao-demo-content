'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCart, PlusCircle, LayoutDashboard } from 'lucide-react'

export function Nav() {
  const { data: session } = useSession()
  const user = session?.user as any

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Marketplace
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/listings" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
            Browse
          </Link>
          {user?.role === 'VENDOR' && (
            <Link href="/listings/create" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              Sell
            </Link>
          )}
          <Link href="/cart" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
            <ShoppingCart className="h-5 w-5" />
          </Link>
          {session ? (
            <div className="flex items-center gap-4">
              <Link href={user?.role === 'VENDOR' || user?.role === 'ADMIN' ? '/dashboard' : '/orders'} className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 flex items-center gap-1">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <button onClick={() => signOut()} className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/auth/signin" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const user = session?.user as any
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'AUTHOR'

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">Content Platform</Link>
        <nav className="flex items-center gap-4 text-sm">
          {pathname.startsWith('/admin') && isAdmin && (
            <>
              <Link href="/admin" className="hover:underline">Dashboard</Link>
              <Link href="/admin/articles/new" className="hover:underline">New Article</Link>
            </>
          )}
          {session ? (
            <button onClick={() => signOut()} className="hover:underline">Sign Out</button>
          ) : (
            <Link href="/signin" className="hover:underline">Sign In</Link>
          )}
        </nav>
      </div>
    </header>
  )
}

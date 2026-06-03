'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export function Header() {
  const { data: session } = useSession()
  const user = session?.user as any

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">Security Portal</Link>
        {session && (
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <Link href="/documents" className="hover:underline">Documents</Link>
            <Link href="/audit" className="hover:underline">Audit</Link>
            <Link href="/settings" className="hover:underline">Settings</Link>
            {user?.role === 'SYSTEM_ADMIN' && (
              <>
                <Link href="/admin/organizations" className="hover:underline">Orgs</Link>
                <Link href="/admin/users" className="hover:underline">Users</Link>
              </>
            )}
            <span className="text-gray-500 text-xs">{user?.role?.replace('_', ' ')}</span>
            <button onClick={() => signOut()} className="hover:underline">Sign Out</button>
          </nav>
        )}
        {!session && (
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/signin" className="hover:underline">Sign In</Link>
          </nav>
        )}
      </div>
    </header>
  )
}

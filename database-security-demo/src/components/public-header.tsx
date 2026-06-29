'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export function PublicHeader() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 border-b border-isla-border bg-isla-obsidian/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full border-2 border-isla-amethyst flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-isla-amethyst" />
          </span>
          <span className="font-semibold text-sm text-isla-white">IslaVault</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/security" className="text-isla-muted hover:text-isla-white transition-colors">Security</Link>
          <Link href="/architecture" className="text-isla-muted hover:text-isla-white transition-colors">Architecture</Link>
          <Link href="/case-study" className="text-isla-muted hover:text-isla-white transition-colors">Case Study</Link>
          <Link href="/demo" className="text-isla-muted hover:text-isla-white transition-colors">Demo</Link>
          {session ? (
            <Link href="/dashboard" className="px-4 py-1.5 rounded-lg text-sm font-medium bg-isla-amethyst text-white hover:bg-isla-amethyst/90 transition-colors">
              Dashboard
            </Link>
          ) : (
            <Link href="/signin" className="px-4 py-1.5 rounded-lg text-sm font-medium border border-isla-border text-isla-white hover:bg-isla-glass transition-colors">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

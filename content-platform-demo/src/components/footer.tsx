'use client'

import Link from 'next/link'
import { Rss } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-8 border-t border-border bg-card dark:border-border-dark dark:bg-card-dark">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 text-xs text-text-muted">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-text-secondary">Likha</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <Link href="/category" className="transition-colors hover:text-primary">Categories</Link>
          <Link href="/rss.xml" className="flex items-center gap-1 transition-colors hover:text-primary">
            <Rss className="h-3 w-3" />
            RSS
          </Link>
          <button
            onClick={() => { localStorage.removeItem('likha-welcome-dismissed'); location.reload() }}
            className="transition-colors hover:text-primary"
          >
            Reset
          </button>
        </div>
      </div>
    </footer>
  )
}

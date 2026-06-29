'use client'

import Link from 'next/link'
import { Rss } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border">
      <div className="container-likha flex flex-col items-center justify-between gap-2 py-6 text-xs text-text-muted md:flex-row">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-text-primary">Likha</span>
          <span className="hidden md:inline">&middot;</span>
          <span className="hidden md:inline">&copy; {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-text-primary transition-colors">Home</Link>
          <Link href="/guidelines" className="hover:text-text-primary transition-colors">Guidelines</Link>
          <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-text-primary transition-colors">Terms</Link>
          <Link href="/copyright" className="hover:text-text-primary transition-colors">Copyright</Link>
          <Link href="/rss.xml" className="flex items-center gap-1 hover:text-text-primary transition-colors">
            <Rss className="h-3 w-3" /> RSS
          </Link>
        </div>
      </div>
    </footer>
  )
}

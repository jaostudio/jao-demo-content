'use client'

import Link from 'next/link'
import { Rss } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-12 border-t-2 border-black bg-black dark:border-white dark:bg-[#111]">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-4">
            <p className="font-display text-lg font-bold text-white">Likha</p>
            <span className="text-neutral-500">&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-neutral-400">
            <Link href="/" className="transition-colors hover:text-saffron-400">Home</Link>
            <Link href="/category" className="transition-colors hover:text-saffron-400">Categories</Link>
            <Link href="/rss.xml" className="flex items-center gap-1 transition-colors hover:text-saffron-400">
              <Rss className="h-3 w-3" />
              RSS
            </Link>
            <button
              onClick={() => { localStorage.removeItem('likha-welcome-dismissed'); location.reload() }}
              className="text-neutral-600 transition-colors hover:text-saffron-400"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

'use client'

import Link from 'next/link'

export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  console.error('[admin] Error boundary caught:', error.message)

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <p className="mb-2 text-lg font-semibold text-text-primary">Something went wrong</p>
      <p className="mb-1 text-sm text-text-muted">The admin dashboard hit an unexpected error.</p>
      <p className="mb-6 text-xs text-text-muted">This is usually a temporary issue with the backend connection.</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-border bg-card px-5 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-alt"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}

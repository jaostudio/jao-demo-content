'use client'

import Link from 'next/link'

export default function OrderError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <span className="text-6xl">📦</span>
      <h1 className="mt-6 text-2xl font-bold">Hala, nawala ang order!</h1>
      <p className="mt-2 text-muted">Baka umuulan — restart mo ang modem. Kung nakapag-order ka, nasa system pa rin yan.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button onClick={reset} className="inline-flex h-11 items-center justify-center rounded-xl bg-flag-blue px-6 text-sm font-semibold text-white shadow-lg shadow-flag-blue/25 transition-all hover:brightness-90">
          Try Again
        </button>
        <Link href="/" className="inline-flex h-11 items-center justify-center rounded-xl border border-subtle px-6 text-sm font-semibold transition-colors hover:border-subtle">
          Bumalik sa Home
        </Link>
      </div>
    </div>
  )
}
import Link from 'next/link'
import { verticals } from '../content'

export default function LandingPageHome() {
  const items = Object.values(verticals)

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Landing Page Demo</h1>
      <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
        A conversion-optimized landing page architecture with swappable industry verticals.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((v) => (
          <Link
            key={v.slug}
            href={`/${v.slug}`}
            className="group rounded-xl border border-neutral-200 bg-neutral-50 p-8 transition-colors hover:border-brand-500 hover:bg-brand-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-brand-600 dark:hover:bg-brand-950"
          >
            <h2 className="text-xl font-semibold group-hover:text-brand-600">{v.name}</h2>
            <p className="mt-2 text-sm text-neutral-500">{v.tagline}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}

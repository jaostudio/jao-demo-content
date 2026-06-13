'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface HeroStats {
  articles: number
  authors: number
  categories: number
}

export function HeroSection({ stats }: { stats: HeroStats }) {
  const { data: session } = useSession()

  const statItems = [
    { label: 'Articles published', value: stats.articles },
    { label: 'Active authors', value: stats.authors },
    { label: 'Categories', value: stats.categories },
  ]

  return (
    <section className="relative overflow-hidden border-b-2 border-black bg-saffron-500 dark:border-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center">
            <p className="mb-4 inline-flex w-fit border-2 border-black bg-cream px-3 py-1 text-xs font-bold uppercase tracking-wider dark:border-white dark:bg-[#1A1A1A]">
              Community Information Hub
            </p>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-black md:text-5xl dark:text-white">
              Magkwento. Magbahagi.{' '}
              <span className="squiggle-underline">Mag-aral.</span>
            </h1>
            <p className="mb-8 text-lg text-black/70 dark:text-white/70">
              The Philippine Community Information Hub — opinyon, kwento, at impormasyon para sa bawat Pilipino.
            </p>
            {!session && (
              <div className="flex gap-3">
                <Link
                  href="/register"
                  className="rounded-none border-2 border-black bg-black px-5 py-2.5 text-sm font-bold text-saffron-500 transition-all hover:nb-shadow dark:border-white dark:bg-white dark:text-black"
                >
                  Sumali sa Likha
                </Link>
                <Link
                  href="/signin"
                  className="rounded-none border-2 border-black bg-cream px-5 py-2.5 text-sm font-bold text-black transition-all hover:nb-shadow dark:border-white dark:bg-[#1A1A1A] dark:text-white"
                >
                  Mag-sign In
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full space-y-4 border-2 border-black bg-cream p-6 nb-shadow-lg dark:border-white dark:bg-[#1A1A1A]">
              {statItems.map((item, i) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-4 animate-fade-in-up stagger-${i + 1}`}
                >
                  <span className="flex h-3 w-3 animate-pulse-dot rounded-full bg-coral-400" />
                  <div className="flex-1">
                    <p className="text-2xl font-bold text-black dark:text-white">{item.value}</p>
                    <p className="text-sm text-black/60 dark:text-white/60">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

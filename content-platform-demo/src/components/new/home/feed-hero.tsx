'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { LikhaLogo } from '@/components/brand/likha-logo'

const DRIFTING_AVATARS = [
  { initial: 'S', x: 72, y: 18, delay: 0 },
  { initial: 'M', x: 82, y: 62, delay: 1.2 },
  { initial: 'T', x: 12, y: 72, delay: 2.4 },
  { initial: 'L', x: 90, y: 38, delay: 0.8 },
]

export function FeedHero() {
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section ref={ref} className="relative overflow-hidden rounded-2xl border border-hairline bg-surface p-8 mb-6 min-h-[260px]">
      {/* Scanline texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-void-black) 2px, var(--color-void-black) 3px)',
      }} />

      {/* Grid texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(var(--color-reactor-green) 1px, transparent 1px), linear-gradient(90deg, var(--color-reactor-green) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Gradient orbs */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: 'radial-gradient(circle at 20% 40%, var(--color-reactor-green) 0%, transparent 50%), radial-gradient(circle at 80% 60%, var(--color-voltage-pink) 0%, transparent 50%)',
      }} />

      {/* Drifting avatars */}
      {mounted && DRIFTING_AVATARS.map((a) => (
        <div
          key={a.initial}
          className="pointer-events-none absolute hidden md:flex h-8 w-8 items-center justify-center rounded-full border border-hairline bg-card text-[11px] font-bold text-text-primary animate-drift"
          style={{
            left: `${a.x}%`,
            top: `${a.y}%`,
            animationDelay: `${a.delay}s`,
            animationDuration: '18s',
          }}
        >
          {a.initial}
        </div>
      ))}

      <div className="relative z-10 max-w-xl">
        <div className="flex items-center gap-2 mb-4">
          <LikhaLogo variant="lockup" size="sm" />
        </div>
        <h1 className="text-[32px] font-semibold leading-[1.05] tracking-[-0.04em] text-text-primary">
          Follow the work before<br />it becomes finished.
        </h1>
        <p className="mt-4 max-w-md text-[14px] text-graphite leading-relaxed">
          A process-first social publishing platform for artists. Publish live works, process notes, collections, and studio dispatches.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 rounded-full bg-reactor-green px-5 py-2 text-[13px] font-medium text-void-black hover:bg-reactor-green/90 transition-colors"
          >
            Explore Works
          </Link>
          <Link
            href="/studio"
            className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-5 py-2 text-[13px] font-medium text-text-primary hover:bg-surface-alt transition-colors"
          >
            Open Studio
          </Link>
        </div>
      </div>
    </section>
  )
}

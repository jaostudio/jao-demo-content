'use client'

import Link from 'next/link'

interface DemoTourCardProps {
  user?: { role: string } | null
}

const STEPS = [
  { num: 1, label: 'Browse the feed', href: '/', authRequired: false },
  { num: 2, label: 'Open a work\u2019s process', href: '/work/character-design-the-guardian', authRequired: false },
  { num: 3, label: 'Sign in as Artist', href: '/signin?email=sarah%40content.dev&next=/studio', authRequired: false },
  { num: 4, label: 'Open Studio', href: '/signin?next=/studio', authRequired: false },
  { num: 5, label: 'Sign in as Admin', href: '/signin?email=admin%40content.dev&next=/admin', authRequired: false },
  { num: 6, label: 'Review moderation', href: '/signin?next=/admin', authRequired: false },
]

const AUTH_STEPS = [
  { num: 1, label: 'Browse the feed', href: '/', authRequired: false },
  { num: 2, label: 'Open a work\u2019s process', href: '/work/character-design-the-guardian', authRequired: false },
  { num: 4, label: 'Open Studio', href: '/studio', authRequired: 'AUTHOR' },
  { num: 6, label: 'Review moderation', href: '/admin', authRequired: 'ADMIN' },
]

export function DemoTourCard({ user }: DemoTourCardProps) {
  const steps = user ? AUTH_STEPS : STEPS

  const visibleSteps = steps.filter((s) => {
    if (!s.authRequired) return true
    if (!user) return false
    if (s.authRequired === 'AUTHOR') return user.role === 'AUTHOR' || user.role === 'ADMIN'
    if (s.authRequired === 'ADMIN') return user.role === 'ADMIN'
    return true
  })

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-voltage-pink" />
        <p className="text-[11px] font-semibold text-text-primary">Demo Tour</p>
      </div>
      <div className="space-y-1">
        {visibleSteps.map((step) => (
          <Link
            key={step.num}
            href={step.href}
            className="flex items-center gap-2.5 rounded-lg border border-hairline px-2.5 py-1.5 text-[11px] text-graphite hover:border-reactor-green/40 hover:bg-surface-alt transition-all"
          >
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-surface-alt text-[9px] font-medium text-fog-gray">
              {step.num}
            </span>
            <span>{step.label}</span>
            <span className="ml-auto text-ash">&rarr;</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

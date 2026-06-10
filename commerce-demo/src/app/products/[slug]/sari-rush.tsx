'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { useLang } from '@/lib/use-lang'

export function SariRush() {
  const lang = useLang()
  const [timeLeft, setTimeLeft] = useState(120)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (timeLeft <= 0) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [timeLeft])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  if (timeLeft <= 0) {
    return (
      <div className="mt-4 rounded-xl bg-surface px-4 py-3 text-center dark:bg-surface">
        <p className="text-sm font-medium text-muted">{lang === 'tl' ? 'Nag-reset ang timer — refresh page para sa bagong Sari-Rush!' : 'Timer reset — refresh page for a new Sari-Rush!'}</p>
      </div>
    )
  }

  return (
    <div className={`mt-4 rounded-xl px-4 py-3 ${!reducedMotion && timeLeft <= 30 ? 'bg-flag-red animate-pulse-soft' : 'bg-flag-red'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className={`h-4 w-4 ${!reducedMotion && timeLeft <= 30 ? 'animate-pulse' : ''} text-white`} />
          <span className={`text-sm font-semibold ${!reducedMotion && timeLeft <= 30 ? 'animate-pulse' : ''} text-white`}>Sari-Rush!</span>
        </div>
        <span className={`font-mono text-lg font-bold ${!reducedMotion && timeLeft <= 30 ? 'animate-pulse' : ''} text-white`}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>
      <p className="mt-1 text-xs text-white/80">{lang === 'tl' ? 'Sari-Rush window — bilisan mo at baka maubusan!' : 'Sari-Rush window — hurry before it runs out!'}</p>
    </div>
  )
}

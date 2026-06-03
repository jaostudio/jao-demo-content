'use client'

import { useEffect } from 'react'
import { trackRaw, EVENTS } from '@/lib/analytics'
import type { EventName } from '@/lib/analytics'

interface Props {
  eventName: EventName
  thresholds?: number[]
}

export function PageScrollTracker({ eventName, thresholds = [25, 50, 75, 90] }: Props) {
  useEffect(() => {
    const fired = new Set<number>()

    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return
      const percent = Math.round((scrollTop / docHeight) * 100)

      for (const t of thresholds) {
        if (percent >= t && !fired.has(t)) {
          fired.add(t)
          trackRaw(eventName, { depth: t })
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [eventName, thresholds])

  return null
}

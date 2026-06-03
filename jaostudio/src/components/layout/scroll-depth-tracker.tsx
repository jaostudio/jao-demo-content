'use client'

import { useEffect } from 'react'
import { trackScrollDepth, trackEngagement } from '@/lib/analytics'

export function ScrollDepthTracker() {
  useEffect(() => {
    const thresholds = [25, 50, 75, 90, 100]
    const fired = new Set<number>()
    let engaged = false
    const startTime = performance.now()

    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return
      const percent = Math.round((scrollTop / docHeight) * 100)

      for (const t of thresholds) {
        if (percent >= t && !fired.has(t)) {
          fired.add(t)
          trackScrollDepth(t)
        }
      }

      if (!engaged && percent >= 25) {
        engaged = true
        trackEngagement(percent, Math.round(performance.now() - startTime))
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return null
}

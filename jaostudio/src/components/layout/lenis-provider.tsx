'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from 'framer-motion'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (prefersReducedMotion) return

    let lenis: Lenis | null = null
    let rafId = 0
    let cancelled = false

    function start() {
      if (cancelled) return
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      })

      lenisRef.current = lenis
      ;(window as unknown as Record<string, unknown>).__lenis = lenis

      function onFrame(time: number) {
        if (lenis) {
          lenis.raf(time)
          rafId = requestAnimationFrame(onFrame)
        }
      }

      rafId = requestAnimationFrame(onFrame)
    }

    // Defer Lenis init until the browser is idle. Lenis is progressive
    // enhancement (smooth scroll); the page is usable without it during
    // the idle wait. Saves ~60ms of TBT on first paint (Phase 2B
    // attribution: lenis-provider actualDuration 59.8ms on /).
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback
    if (typeof ric === 'function') {
      ric(start)
    } else {
      const t = window.setTimeout(start, 200)
      return () => {
        cancelled = true
        window.clearTimeout(t)
        if (rafId) cancelAnimationFrame(rafId)
        if (lenis) lenis.destroy()
        delete (window as unknown as Record<string, unknown>).__lenis
      }
    }

    return () => {
      cancelled = true
      if (rafId) cancelAnimationFrame(rafId)
      if (lenis) lenis.destroy()
      delete (window as unknown as Record<string, unknown>).__lenis
    }
  }, [prefersReducedMotion])

  return <>{children}</>
}

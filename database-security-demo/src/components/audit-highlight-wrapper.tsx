'use client'

import { useEffect, useRef, type ReactNode } from 'react'

export function AuditHighlightWrapper({ highlight, children }: { highlight?: string; children: ReactNode }) {
  const rendered = useRef(false)

  useEffect(() => {
    if (!highlight || rendered.current) return
    rendered.current = true

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const el = document.querySelector(`[data-event-id="${highlight}"]`)
    if (!el) return

    el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'center' })

    el.classList.add('ring-2', 'ring-isla-amethyst/70', 'rounded-lg')

    const timer = setTimeout(() => {
      el.classList.remove('ring-2', 'ring-isla-amethyst/70', 'rounded-lg')
    }, 3000)

    return () => clearTimeout(timer)
  }, [highlight])

  return <>{children}</>
}

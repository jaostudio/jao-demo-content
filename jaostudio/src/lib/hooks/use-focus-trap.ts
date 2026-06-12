'use client'

import { useEffect, useRef, type RefObject } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

export function useFocusTrap(active: boolean, returnRef?: RefObject<HTMLElement | null>) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active || !ref.current) return

    const container = ref.current
    const previouslyFocused = document.activeElement as HTMLElement | null
    const focusTarget = returnRef?.current || previouslyFocused

    const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE)
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    first?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        const close = container.querySelector<HTMLButtonElement>('[data-close-menu]')
        close?.click()
        return
      }

      if (e.key !== 'Tab') return
      if (!focusable.length) return

      const current = document.activeElement
      const goingForward = !e.shiftKey

      if (goingForward && current === last) {
        e.preventDefault()
        first?.focus()
      } else if (!goingForward && current === first) {
        e.preventDefault()
        last?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      focusTarget?.focus()
    }
  }, [active, returnRef])

  return ref
}

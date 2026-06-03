'use client'

import { useEffect } from 'react'
import { shouldRunEntry, clearPendingEntry } from '@/lib/locale-transition'

export function PageTransition({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!shouldRunEntry()) return
    clearPendingEntry()

    const main = document.getElementById('main-content')
    if (!main) return

    requestAnimationFrame(() => {
      main.classList.add('locale-pre-enter')

      requestAnimationFrame(() => {
        main.classList.remove('locale-pre-enter')
        main.classList.add('locale-enter')
        main.addEventListener('transitionend', () => {
          main.classList.remove('locale-enter')
        }, { once: true })
      })
    })
  }, [])

  return <>{children}</>
}

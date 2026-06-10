'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useEffectiveRole } from '@/hooks/use-effective-role'

const STORAGE_KEY = 'likha-welcome-dismissed'

export function WelcomeBanner() {
  const [dismissed, setDismissed] = useState(true)
  const { role, isDemoMode } = useEffectiveRole()

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) setDismissed(false)
  }, [])

  if (dismissed) return null
  if (isDemoMode || role !== 'READER') return null

  function handleDismiss() {
    localStorage.setItem(STORAGE_KEY, 'true')
    setDismissed(true)
  }

  return (
    <div className="relative border-2 border-black bg-saffron-100 px-5 py-4 nb-shadow dark:border-white dark:bg-saffron-900/30">
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-3 rounded-full border border-black p-0.5 text-black hover:bg-saffron-200 dark:border-white dark:text-white dark:hover:bg-saffron-800/50"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
      <p className="pr-6 text-sm font-bold text-black dark:text-white">
        Magandang araw! Narito ang mga bagong kwento mula sa inyong komunidad. Basahin, matuto, at makibahagi.
      </p>
    </div>
  )
}

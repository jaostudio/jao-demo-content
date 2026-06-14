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
    <div className="relative mb-4 rounded-lg border border-primary-light bg-primary-light px-4 py-3 dark:border-primary/20 dark:bg-primary/10">
      <button
        onClick={handleDismiss}
        className="absolute right-2 top-2 rounded-full p-0.5 text-text-muted hover:text-text-secondary"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <p className="pr-6 text-sm text-primary">
        Magandang araw! Narito ang mga bagong kwento mula sa inyong komunidad. Basahin, matuto, at makibahagi.
      </p>
    </div>
  )
}

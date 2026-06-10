'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

export function NetworkStatus() {
  useEffect(() => {
    const show = (online: boolean) => {
      if (!online) toast.warning('You\'re offline. Some features may not work.', { duration: Infinity })
      else toast.dismiss(); toast.success('Back online!', { duration: 3000 })
    }
    window.addEventListener('offline', () => show(false))
    window.addEventListener('online', () => show(true))
    if (!navigator.onLine) show(false)
  }, [])
  return null
}

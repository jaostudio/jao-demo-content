'use client'

import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!show) return null

  async function handleInstall() {
    if (!deferredPrompt) return
    ;(deferredPrompt as any).prompt()
    const result = await (deferredPrompt as any).userChoice
    setShow(false)
    setDeferredPrompt(null)
  }

  return (
    <button
      onClick={handleInstall}
      className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-2xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-warm-md transition-all hover:bg-primary-600 hover:shadow-warm-lg"
    >
      <Download className="h-4 w-4" />
      Install Likha
    </button>
  )
}

'use client'

import { useState, useEffect } from 'react'

export function FlashSaleTimer({ endTime }: { endTime: string }) {
  const [remaining, setRemaining] = useState('')

  useEffect(() => {
    const tick = () => {
      const diff = new Date(endTime).getTime() - Date.now()
      if (diff <= 0) { setRemaining('Ended'); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setRemaining(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [endTime])

  if (!remaining) return null

  return (
    <div className="inline-flex items-center gap-1.5 rounded-lg bg-flag-red/10 px-3 py-1 text-xs font-bold text-flag-red">
      <span className="animate-pulse">⏰</span> {remaining}
    </div>
  )
}

'use client'

import dynamic from 'next/dynamic'

const ScrollGlow = dynamic(() => import('@/components/layout/scroll-glow'), { ssr: false })

export function ClientScrollGlow() {
  return <ScrollGlow />
}

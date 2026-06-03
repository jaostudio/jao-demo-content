'use client'

import { useEffect } from 'react'
import { track, EVENTS } from '@/lib/analytics'

export function ProjectViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    track(EVENTS.PROJECT_VIEWED, { project: slug })
  }, [slug])

  return null
}

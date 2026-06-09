'use client'

import { useEffect, useRef } from 'react'
import { useLocale } from 'next-intl'
import { track } from '@/lib/analytics'
import { EVENTS } from '@/lib/analytics/events'

export function ServicesPageTracker() {
  const locale = useLocale()
  const engagementSent = useRef(false)
  const projectFitSent = useRef(false)

  useEffect(() => {
    track(EVENTS.SERVICES_VIEW, { locale })
  }, [locale])

  useEffect(() => {
    const engagementEl = document.getElementById('engagement-models')
    const projectFitEl = document.getElementById('project-fit')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (entry.target.id === 'engagement-models' && !engagementSent.current) {
              engagementSent.current = true
              track(EVENTS.ENGAGEMENT_MODEL_VIEW, { locale })
            }
            if (entry.target.id === 'project-fit' && !projectFitSent.current) {
              projectFitSent.current = true
              track(EVENTS.PROJECT_FIT_VIEW, { locale })
            }
          }
        }
      },
      { threshold: 0.3 }
    )

    if (engagementEl) observer.observe(engagementEl)
    if (projectFitEl) observer.observe(projectFitEl)

    return () => observer.disconnect()
  }, [locale])

  return null
}

'use client'

import { useEffect } from 'react'

type PageView = { pathname: string; search?: string }
type EventPayload = Record<string, string | number | boolean>

let analytics: Array<{ pageview: (data: PageView) => void; event: (name: string, payload?: EventPayload) => void }> = []

export function registerAnalyticsProvider(provider: { pageview: (data: PageView) => void; event: (name: string, payload?: EventPayload) => void }) {
  analytics.push(provider)
  return () => { analytics = analytics.filter((p) => p !== provider) }
}

export function trackPageview(pathname: string, search?: string) {
  analytics.forEach((p) => p.pageview({ pathname, search }))
}

export function trackEvent(name: string, payload?: EventPayload) {
  analytics.forEach((p) => p.event(name, payload))
}

export function usePageviewTracking() {
  useEffect(() => {
    trackPageview(window.location.pathname, window.location.search)
  }, [])
}

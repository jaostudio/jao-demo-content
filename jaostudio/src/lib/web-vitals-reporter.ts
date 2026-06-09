'use client'

import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals'

type MetricData = {
  name: string
  value: number
  rating: string
}

function sendToPostHog(metric: MetricData) {
  if (typeof window === 'undefined') return

  try {
    const posthog = (window as unknown as Record<string, unknown>).posthog
    if (posthog && typeof posthog === 'object' && 'capture' in posthog) {
      ;(posthog as { capture: (event: string, props: Record<string, unknown>) => void }).capture('$web_vitals', metric)
    }
  } catch {
  }
}

function handleMetric(metric: { name: string; value: number; rating: string }) {
  sendToPostHog({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
  })
}

export function reportWebVitals() {
  onCLS(handleMetric)
  onINP(handleMetric)
  onLCP(handleMetric)
  onFCP(handleMetric)
  onTTFB(handleMetric)
}

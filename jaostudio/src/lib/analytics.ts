'use client'

import posthog from 'posthog-js'
import { EVENTS, ANALYTICS_SCHEMA_VERSION } from './analytics/events'
import { buildTrackingContext } from './analytics/context'
import type { EventName, EventPayloadMap } from './analytics/events'

export { EVENTS }
export type { EventName }

function getAnalyticsContext() {
  if (typeof window === 'undefined') return {}
  return {
    schema_version: ANALYTICS_SCHEMA_VERSION,
    route: window.location.pathname,
    ...buildTrackingContext(),
  }
}

function capture(name: string, properties: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  posthog.capture(name, { ...getAnalyticsContext(), ...properties })
}

export function track<E extends EventName>(event: E, properties: EventPayloadMap[E]): void {
  capture(event, properties as Record<string, unknown>)
}

export function trackRaw(name: string, properties: Record<string, unknown>) {
  capture(name, properties)
}

export function trackCTA(label: string, location: string) {
  capture(EVENTS.CTA_CLICKED, { label, location })
}

export function trackProjectClick(project: string, location: string) {
  capture(EVENTS.PROJECT_CLICKED, { project, location })
}

export function trackScrollDepth(depth: number) {
  capture(EVENTS.SCROLL_DEPTH, { depth })
}

export function trackEngagement(depth: number, timeOnPageMs: number) {
  capture(EVENTS.ENGAGED, { depth, time_on_page_ms: timeOnPageMs })
}

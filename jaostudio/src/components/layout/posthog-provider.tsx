'use client'

import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect, useState } from 'react'
import type PostHogClient from 'posthog-js'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<typeof PostHogClient | null>(null)

  useEffect(() => {
    if (!POSTHOG_KEY) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[PostHog] Missing NEXT_PUBLIC_POSTHOG_KEY - analytics disabled')
      }
      return
    }

    const load = () => {
      import('posthog-js').then(({ default: posthog }) => {
        posthog.init(POSTHOG_KEY, {
          api_host: POSTHOG_HOST,
          capture_pageview: false,
          capture_pageleave: true,
          persistence: 'localStorage+cookie',
          advanced_disable_decide: true,
        })
        setClient(posthog)
      })
    }

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(load, { timeout: 2000 })
    } else {
      setTimeout(load, 2000)
    }
  }, [])

  if (!client) return <>{children}</>

  return <PHProvider client={client}>{children}</PHProvider>
}

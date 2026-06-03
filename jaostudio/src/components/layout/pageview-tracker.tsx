'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import posthog from 'posthog-js'

function getLocaleFromPath(pathname: string): string {
  const match = pathname.match(/^\/(en|tl)(\/|$)/)
  return match ? match[1] : 'en'
}

export function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && posthog.__loaded) {
      posthog.capture('$pageview', {
        $current_url: `${window.location.origin}${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`,
        locale: getLocaleFromPath(pathname),
        referrer: document.referrer || undefined,
      })
    }
  }, [pathname, searchParams])

  return null
}

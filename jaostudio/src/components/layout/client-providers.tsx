'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const LenisProvider = dynamic(
  () => import('./lenis-provider').then((mod) => mod.LenisProvider),
  { ssr: false, loading: () => null }
)

const PostHogProvider = dynamic(
  () => import('./posthog-provider').then((mod) => mod.PostHogProvider),
  { ssr: false, loading: () => null }
)

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      <LenisProvider>{children}</LenisProvider>
    </PostHogProvider>
  )
}

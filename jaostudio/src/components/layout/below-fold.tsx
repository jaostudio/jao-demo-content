"use client"

import dynamic from 'next/dynamic'
import React from 'react'
import { SystemsProof } from '@/components/sections/systems-proof'
import { SkeletonSection } from '@/components/ui/skeleton'

const ProcessScrollytelling = dynamic(
  () => import('@/components/sections/process-scrollytelling').then((m) => m.ProcessScrollytelling),
  { ssr: false, loading: () => <SkeletonSection /> },
)
const ContactSection = dynamic(
  () => import('@/components/sections/contact-section').then((m) => m.ContactSection),
  { ssr: false, loading: () => <SkeletonSection /> },
)

export function BelowFold() {
  return (
    <>
      <SystemsProof />
      <ProcessScrollytelling />
      <ContactSection />
    </>
  )
}

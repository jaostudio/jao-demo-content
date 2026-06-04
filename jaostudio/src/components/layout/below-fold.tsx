"use client"

import dynamic from 'next/dynamic'
import React from 'react'
import { SystemsProof } from '@/components/sections/systems-proof'

const ProcessScrollytelling = dynamic(
  () => import('@/components/sections/process-scrollytelling').then((m) => m.ProcessScrollytelling),
  { ssr: false, loading: () => null },
)
const TechCredibility = dynamic(
  () => import('@/components/sections/tech-credibility').then((m) => m.TechCredibility),
  { ssr: false, loading: () => null },
)
const SocialProof = dynamic(
  () => import('@/components/sections/social-proof').then((m) => m.SocialProof),
  { ssr: false, loading: () => null },
)
const ContactSection = dynamic(
  () => import('@/components/sections/contact-section').then((m) => m.ContactSection),
  { ssr: false, loading: () => null },
)

export function BelowFold() {
  return (
    <>
      <SystemsProof />
      <ProcessScrollytelling />
      <TechCredibility />
      <SocialProof />
      <ContactSection />
    </>
  )
}

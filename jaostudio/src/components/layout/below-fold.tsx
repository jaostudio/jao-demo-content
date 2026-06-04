"use client"

import dynamic from 'next/dynamic'
import React from 'react'
import { SystemsProof } from '@/components/sections/systems-proof'

const FeaturedProjects = dynamic(
  () => import('@/components/sections/featured-projects').then((m) => m.FeaturedProjects),
  { ssr: false, loading: () => null },
)
const ProcessScrollytelling = dynamic(
  () => import('@/components/sections/process-scrollytelling').then((m) => ({ default: m.ProcessScrollytelling })),
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
      <FeaturedProjects />
      <ProcessScrollytelling />
      <TechCredibility />
      <SocialProof />
      <ContactSection />
    </>
  )
}

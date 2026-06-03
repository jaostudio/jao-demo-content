'use client'

import { PreviewRenderer } from '@/components/project-preview/preview-renderer'
import type { ProjectMetadata } from '@/types'

interface DeviceFrameProps {
  src?: string
  alt: string
  url?: string
  className?: string
}

export function DeviceFrame({ src, alt, url, className }: DeviceFrameProps) {
  const slug = alt.toLowerCase().replace(/\s+/g, '-')
  const project: ProjectMetadata = {
    slug,
    title: alt,
    summary: '',
    industry: '',
    category: '',
    timeline: '',
    projectTier: 'concept',
    date: '',
    stack: [],
    metrics: { lighthouse: 0, performance: '', seo: '', responsive: false },
    deliverables: [],
    challenges: [],
    context: '',
    constraints: [],
    keyDecisions: [],
    outcome: '',
    businessContext: { who: '', problem: '', solution: '', result: '' },
    gallery: src ? [src] : [],
    liveUrl: url ?? '',
  }

  return <PreviewRenderer project={project} className={className} />
}

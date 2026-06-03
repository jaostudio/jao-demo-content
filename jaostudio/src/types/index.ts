import type { ProjectType } from '@/lib/project-types'
import type { ArchitectureData } from '@/types/architecture'

export type { ProjectType }

export interface ContactIntent {
  projectType?: ProjectType
  budget?: string
  source?: string
}

export interface ProjectMetadata {
  slug: string
  title: string
  summary: string
  industry: string
  category: string
  projectType?: ProjectType
  timeline: string
  projectTier: 'flagship' | 'production' | 'concept'
  previewType?: 'screenshot' | 'iframe'
  date: string
  stack: string[]
  metrics: {
    lighthouse: number
    performance: string
    seo: string
    responsive: boolean
  }
  performance?: {
    lcp?: string
    cls?: string
    inp?: string
    bundleSize?: string
    ttfb?: string
  }
  deliverables: string[]
  challenges: string[]
  context: string
  constraints: string[]
  keyDecisions: {
    decision: string
    tradeoff: string
    rationale?: string
    rejectedAlternatives?: string
    outcome?: string
  }[]
  outcome: string
  businessContext: {
    who: string
    problem: string
    solution: string
    result: string
  }
  gallery: string[]
  liveUrl: string
  githubUrl?: string
  architecture?: ArchitectureData
  systems?: {
    architecture?: string
    infrastructure?: string
  }
}

export interface PageMetadata {
  slug: string
  title: string
  description: string
  published: boolean
}

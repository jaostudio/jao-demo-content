import type { ServiceId } from '@/lib/services'

export type ProjectSlug = 'isp-platform' | 'landing-page' | 'web-application' | 'saas-frontend' | 'ecommerce-store' | 'design-system' | 'mobile-web-app'

export type SystemId = 'landing' | 'commerce' | 'marketplace' | 'content' | 'webapp' | 'security'

export interface CaseStudy {
  slug: string
  title: string
  industry: string
  status: 'published' | 'draft'
  featured: boolean
  relatedProject: ProjectSlug
  challenge: string
  constraints: string[]
  solution: string
  outcome: string
  lessons: string[]
  relatedServices: ServiceId[]
  relatedDemos: SystemId[]
  architectureSummary?: string
  metrics?: { label: string; value: string }[]
}

import type { CaseStudy, ProjectSlug, SystemId } from './types'
import { constructionOperations } from './construction-operations'
import { customBusinessApp } from './custom-business-app'
import { ecommercePlatform } from './ecommerce-platform'

const ALL: CaseStudy[] = [
  constructionOperations,
  customBusinessApp,
  ecommercePlatform,
]

const bySlug: Record<string, CaseStudy> = {}
for (const cs of ALL) {
  bySlug[cs.slug] = cs
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return bySlug[slug]
}

export function getAllCaseStudies(): CaseStudy[] {
  return ALL
}

export function getPublishedCaseStudies(): CaseStudy[] {
  return ALL.filter((cs) => cs.status === 'published')
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return ALL.filter((cs) => cs.featured && cs.status === 'published')
}

export function getCaseStudiesByService(serviceId: string): CaseStudy[] {
  return ALL.filter(
    (cs) => cs.status === 'published' && cs.relatedServices.includes(serviceId as any),
  )
}

export function getCaseStudiesByProject(projectSlug: string): CaseStudy[] {
  return ALL.filter(
    (cs) => cs.status === 'published' && cs.relatedProject === projectSlug,
  )
}

export type { CaseStudy, ProjectSlug, SystemId }

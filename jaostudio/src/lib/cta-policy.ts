export type CTAPriority = 'primary' | 'secondary' | 'tertiary'

export interface CTASpec {
  label: string
  priority: CTAPriority
  route: string
}

export const CTA_LABELS = {
  START_PROJECT: 'Start a Project',
  VIEW_PROJECTS: 'View Projects',
  REQUEST_AUDIT: 'Request an Audit',
  VIEW_LIVE: 'View Live Site →',
  SIMILAR_PROJECT: 'Start a Similar Project',
} as const

export const CTA_ROUTES = {
  START_PROJECT: '/contact',
  VIEW_PROJECTS: '/projects',
  REQUEST_AUDIT: '/audit',
} as const

export const PROJECT_TYPES = [
  'landing-page',
  'business-site',
  'marketing-site',
  'cms-blog',
  'saas',
  'custom-app',
  'internal-tool',
  'mobile-app',
  'ecommerce',
  'automation',
  'ai-integration',
  'api-backend',
  'redesign',
  'consulting',
  'other',
] as const

export type ProjectType = (typeof PROJECT_TYPES)[number]

export const PROJECT_TYPE_GROUPS = [
  {
    label: 'Marketing',
    values: ['landing-page', 'business-site', 'marketing-site', 'cms-blog'] as const,
  },
  {
    label: 'Applications',
    values: ['saas', 'custom-app', 'internal-tool', 'mobile-app'] as const,
  },
  {
    label: 'Commerce & Automation',
    values: ['ecommerce', 'automation', 'ai-integration'] as const,
  },
  {
    label: 'Technical',
    values: ['api-backend', 'redesign', 'consulting'] as const,
  },
] as const

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  'landing-page': 'Landing Page',
  'business-site': 'Business Website',
  'marketing-site': 'Marketing Website',
  'cms-blog': 'CMS / Blog',
  saas: 'SaaS Platform',
  'custom-app': 'Custom Web App',
  'internal-tool': 'Internal Tool',
  'mobile-app': 'Mobile Web App',
  ecommerce: 'E-commerce Store',
  automation: 'Automation System',
  'ai-integration': 'AI Integration',
  'api-backend': 'API / Backend',
  redesign: 'Redesign / Migration',
  consulting: 'Consulting / Audit',
  other: 'Other',
}

export function isOtherProjectType(value: string): boolean {
  return value === 'other'
}

export function isValidProjectType(value: string): value is ProjectType {
  return PROJECT_TYPES.includes(value as ProjectType)
}

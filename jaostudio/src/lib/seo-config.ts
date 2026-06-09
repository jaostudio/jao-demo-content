export const SITE_URL = 'https://jaostudio.dev'

export type RouteIntent = 'indexable' | 'noindex' | 'internal' | 'hidden' | 'redirect'

export interface RouteConfig {
  path: string
  canonical: string
  intent: RouteIntent
  priority: number
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
}

export const SEO_ROUTES: Record<string, RouteConfig> = {
  home: {
    path: '/',
    canonical: SITE_URL,
    intent: 'indexable',
    priority: 1.0,
    frequency: 'weekly',
  },
  projects: {
    path: '/projects',
    canonical: `${SITE_URL}/projects`,
    intent: 'indexable',
    priority: 0.9,
    frequency: 'weekly',
  },
  services: {
    path: '/services',
    canonical: `${SITE_URL}/services`,
    intent: 'indexable',
    priority: 0.8,
    frequency: 'monthly',
  },
  demos: {
    path: '/demos',
    canonical: `${SITE_URL}/demos`,
    intent: 'indexable',
    priority: 0.7,
    frequency: 'monthly',
  },
  studio: {
    path: '/studio',
    canonical: `${SITE_URL}/studio`,
    intent: 'indexable',
    priority: 0.6,
    frequency: 'monthly',
  },
  contact: {
    path: '/contact',
    canonical: `${SITE_URL}/contact`,
    intent: 'indexable',
    priority: 0.4,
    frequency: 'monthly',
  },
  audit: {
    path: '/audit',
    canonical: `${SITE_URL}/audit`,
    intent: 'indexable',
    priority: 0.4,
    frequency: 'monthly',
  },
  cv: {
    path: '/cv',
    canonical: `${SITE_URL}/cv`,
    intent: 'indexable',
    priority: 0.3,
    frequency: 'monthly',
  },
  caseStudies: {
    path: '/case-studies',
    canonical: `${SITE_URL}/case-studies`,
    intent: 'indexable',
    priority: 0.7,
    frequency: 'weekly',
  },
  playground: {
    path: '/playground',
    canonical: `${SITE_URL}/playground`,
    intent: 'internal',
    priority: 0,
    frequency: 'monthly',
  },
  demoCredentials: {
    path: '/docs/demo-credentials',
    canonical: `${SITE_URL}/docs/demo-credentials`,
    intent: 'internal',
    priority: 0.2,
    frequency: 'monthly',
  },
}

export const ROUTE_HIERARCHY: readonly string[] = [
  'home',
  'projects',
  'projects/[slug]',
  'services',
  'caseStudies',
  'caseStudies/[slug]',
  'studio',
  'demos',
  'contact',
  'audit',
  'cv',
  'demoCredentials',
  'playground',
]

export const SITE_URL = 'https://jaostudio.dev'

export interface RouteConfig {
  path: string
  canonical: string
  indexable: boolean
  sitemapPriority: number
  sitemapFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
}

export const SEO_ROUTES: Record<string, RouteConfig> = {
  home: {
    path: '/',
    canonical: SITE_URL,
    indexable: true,
    sitemapPriority: 1.0,
    sitemapFrequency: 'weekly',
  },
  projects: {
    path: '/projects',
    canonical: `${SITE_URL}/projects`,
    indexable: true,
    sitemapPriority: 0.9,
    sitemapFrequency: 'weekly',
  },
  services: {
    path: '/services',
    canonical: `${SITE_URL}/services`,
    indexable: true,
    sitemapPriority: 0.8,
    sitemapFrequency: 'monthly',
  },
  studio: {
    path: '/studio',
    canonical: `${SITE_URL}/studio`,
    indexable: true,
    sitemapPriority: 0.6,
    sitemapFrequency: 'monthly',
  },
  contact: {
    path: '/contact',
    canonical: `${SITE_URL}/contact`,
    indexable: true,
    sitemapPriority: 0.4,
    sitemapFrequency: 'monthly',
  },
  audit: {
    path: '/audit',
    canonical: `${SITE_URL}/audit`,
    indexable: true,
    sitemapPriority: 0.4,
    sitemapFrequency: 'monthly',
  },
  cv: {
    path: '/cv',
    canonical: `${SITE_URL}/cv`,
    indexable: true,
    sitemapPriority: 0.3,
    sitemapFrequency: 'monthly',
  },
  playground: {
    path: '/playground',
    canonical: `${SITE_URL}/playground`,
    indexable: false,
    sitemapPriority: 0,
    sitemapFrequency: 'monthly',
  },
}

export const ROUTE_HIERARCHY = [
  'home',
  'projects',
  'projects/[slug]',
  'services',
  'studio',
  'contact',
  'audit',
  'cv',
  'playground',
] as const

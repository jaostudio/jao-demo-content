import type { MetadataRoute } from 'next'
import { projects } from '@/lib/projects'
import { SEO_ROUTES, SITE_URL } from '@/lib/seo-config'
import { getPublishedCaseStudies } from '@/lib/case-studies'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = Object.entries(SEO_ROUTES)
    .filter(([_, config]) => config.intent === 'indexable')
    .sort((a, b) => b[1].priority - a[1].priority)
    .map(([_, config]) => ({
      url: config.canonical,
      lastModified: new Date(),
      changeFrequency: config.frequency,
      priority: config.priority,
    }))

  const projectRoutes = projects
    .filter((p) => p.projectTier !== 'concept')
    .map((p) => ({
      url: `${SITE_URL}/projects/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

  const caseStudyRoutes = getPublishedCaseStudies().map((cs) => ({
    url: `${SITE_URL}/case-studies/${cs.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...projectRoutes, ...caseStudyRoutes]
}

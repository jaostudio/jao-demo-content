import type { MetadataRoute } from 'next'
import { projects } from '@/lib/projects'
import { SEO_ROUTES, SITE_URL } from '@/lib/seo-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = Object.entries(SEO_ROUTES)
    .filter(([_, config]) => config.indexable && config.path !== '/playground')
    .map(([_, config]) => ({
      url: config.canonical,
      lastModified: new Date(),
      changeFrequency: config.sitemapFrequency,
      priority: config.sitemapPriority,
    }))

  const projectRoutes = projects
    .filter((p) => p.projectTier !== 'concept')
    .map((p) => ({
      url: `${SITE_URL}/projects/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

  return [...staticRoutes, ...projectRoutes]
}

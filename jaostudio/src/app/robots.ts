import type { MetadataRoute } from 'next'
import { SEO_ROUTES, SITE_URL } from '@/lib/seo-config'

export default function robots(): MetadataRoute.Robots {
  const disallowed = Object.values(SEO_ROUTES)
    .filter((r) => r.intent !== 'indexable')
    .map((r) => r.path)

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowed.length ? disallowed : undefined,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

import { fetchAPI } from '@/lib/api/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jaostudio.dev'

export default async function sitemap() {
  let articleSlugs: { slug: string; updatedAt: string }[] = []
  let categorySlugs: { slug: string }[] = []

  try {
    articleSlugs = await fetchAPI<{ slug: string; updatedAt: string }[]>('/api/articles?select=slug')
  } catch {
    // backend unavailable
  }

  try {
    categorySlugs = await fetchAPI<{ slug: string }[]>('/api/categories')
  } catch {
    // backend unavailable
  }

  const articleUrls = articleSlugs.map((a) => ({
    url: `${SITE_URL}/articles/${a.slug}`,
    lastModified: new Date(a.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categoryUrls = categorySlugs.map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    ...articleUrls,
    ...categoryUrls,
  ]
}



import { fetchAPI } from '@/lib/api/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jaostudio.dev'

export const dynamic = 'force-dynamic'

export default async function sitemap() {
  let articles: { slug: string; createdAt: string }[] = []
  let categorySlugs: { slug: string }[] = []

  try {
    articles = await fetchAPI<{ slug: string; createdAt: string }[]>('/api/articles')
  } catch {
    // backend unavailable
  }

  try {
    categorySlugs = await fetchAPI<{ slug: string }[]>('/api/categories')
  } catch {
    // backend unavailable
  }

  const articleUrls = articles.map((a) => ({
    url: `${SITE_URL}/articles/${a.slug}`,
    lastModified: new Date(a.createdAt),
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



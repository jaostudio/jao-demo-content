import { prisma } from '@/lib/prisma'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jaostudio.dev'

export default async function sitemap() {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true },
  })

  const categories = await prisma.category.findMany({
    select: { slug: true },
  })

  const articleUrls = articles.map((a) => ({
    url: `${SITE_URL}/articles/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categoryUrls = categories.map((c) => ({
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

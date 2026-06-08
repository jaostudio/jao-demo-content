import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await prisma.listing.findMany({
    where: { status: 'APPROVED' },
    select: { slug: true, updatedAt: true, category: { select: { slug: true } } },
  })

  const categories = await prisma.category.findMany({
    select: { slug: true },
  })

  const vendors = await prisma.user.findMany({
    where: { role: 'VENDOR', listings: { some: { status: 'APPROVED' } } },
    select: { id: true, createdAt: true },
  })

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${BASE_URL}/listings`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    ...categories.map((c) => ({
      url: `${BASE_URL}/listings?category=${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...vendors.map((v) => ({
      url: `${BASE_URL}/vendors/${v.id}`,
      lastModified: v.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...listings.map((l) => ({
      url: `${BASE_URL}/listings/${l.slug}`,
      lastModified: l.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    { url: `${BASE_URL}/cart`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${BASE_URL}/compare`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.2 },
    { url: `${BASE_URL}/wishlist`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.2 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.2 },
  ]
}

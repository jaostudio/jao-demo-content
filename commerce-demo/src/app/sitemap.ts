import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://sari-sari-demo.vercel.app'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/cart`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/signin`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/signup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ]
}

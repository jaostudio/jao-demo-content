import { prisma } from '../../src/lib/prisma'
import { AUTHOR_EMAILS, ARTICLE_SLUGS, COLLECTION_OWNER_SLUGS } from './fixtures'

export async function getFixtures() {
  const authors: Record<string, { id: string; role: string; name: string; email: string }> = {}
  for (const [key, email] of Object.entries(AUTHOR_EMAILS)) {
    const a = await prisma.author.findUnique({ where: { email } })
    if (!a) throw new Error(`Author not found: ${email}`)
    authors[key] = { id: a.id, role: a.role, name: a.name, email: a.email }
  }

  const articles: Record<string, { id: string; status: string; authorId: string }> = {}
  for (const [key, slug] of Object.entries(ARTICLE_SLUGS)) {
    const a = await prisma.article.findUnique({ where: { slug } })
    if (!a) throw new Error(`Article not found by slug: ${slug}`)
    articles[key] = { id: a.id, status: a.status, authorId: a.authorId }
  }

  const collections: Record<string, { id: string; ownerId: string }> = {}
  for (const [key, cfg] of Object.entries(COLLECTION_OWNER_SLUGS)) {
    const owner = await prisma.author.findUnique({ where: { email: cfg.ownerEmail } })
    if (!owner) throw new Error(`Owner not found: ${cfg.ownerEmail}`)
    const c = await prisma.collection.findUnique({
      where: { ownerId_slug: { ownerId: owner.id, slug: cfg.slug } },
    })
    if (!c) throw new Error(`Collection not found: ${cfg.ownerEmail}/${cfg.slug}`)
    collections[key] = { id: c.id, ownerId: c.ownerId }
  }

  return { authors, articles, collections }
}

import { Hono } from 'hono'
import { prisma } from '../lib/prisma'
import { authMiddleware } from '../middleware/auth'

const collections = new Hono()

collections.get('/', authMiddleware, async (c) => {
  const userId = c.var.userId as string

  const cols = await prisma.collection.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { items: true } } },
  })

  return c.json(cols.map((col) => ({
    id: col.id,
    title: col.title,
    slug: col.slug,
    description: col.description,
    visibility: col.visibility,
    itemCount: col._count.items,
    createdAt: col.createdAt.toISOString(),
    updatedAt: col.updatedAt.toISOString(),
  })))
})

collections.post('/', authMiddleware, async (c) => {
  const userId = c.var.userId as string
  const { title, description, visibility } = await c.req.json<{
    title: string
    description?: string
    visibility?: 'PUBLIC' | 'PRIVATE' | 'UNLISTED'
  }>()

  if (!title || title.trim().length === 0) {
    return c.json({ error: 'Title is required' }, 400)
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'collection'

  const existing = await prisma.collection.findUnique({
    where: { ownerId_slug: { ownerId: userId, slug } },
  })
  if (existing) {
    return c.json({ error: 'Collection with this title already exists' }, 409)
  }

  const col = await prisma.collection.create({
    data: { ownerId: userId, slug, title, description, visibility: visibility ?? 'PUBLIC' },
  })

  return c.json({
    id: col.id,
    title: col.title,
    slug: col.slug,
    description: col.description,
    visibility: col.visibility,
    createdAt: col.createdAt.toISOString(),
  }, 201)
})

collections.get('/:slug', authMiddleware, async (c) => {
  const userId = c.var.userId as string
  const slug = c.req.param('slug')

  const col = await prisma.collection.findUnique({
    where: { ownerId_slug: { ownerId: userId, slug } },
    include: {
      items: {
        include: { article: { include: { author: true, category: true, _count: { select: { comments: true } } } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!col) {
    return c.json({ error: 'Collection not found' }, 404)
  }

  return c.json({
    id: col.id,
    title: col.title,
    slug: col.slug,
    description: col.description,
    visibility: col.visibility,
    createdAt: col.createdAt.toISOString(),
    items: col.items.map((item) => ({
      id: item.id,
      articleId: item.articleId,
      title: item.article.title,
      slug: item.article.slug,
      excerpt: item.article.excerpt,
      image: item.article.imageUrl,
      format: item.article.format,
      authorName: item.article.author.name,
      categoryName: item.article.category.name,
      commentCount: item.article._count.comments,
      addedAt: item.createdAt.toISOString(),
    })),
  })
})

collections.post('/:slug/items', authMiddleware, async (c) => {
  const userId = c.var.userId as string
  const slug = c.req.param('slug')
  const { articleId } = await c.req.json<{ articleId: string }>()

  if (!articleId) {
    return c.json({ error: 'articleId is required' }, 400)
  }

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { status: true },
  })
  if (!article || article.status !== 'PUBLISHED') {
    return c.json({ error: 'NOT_FOUND', message: 'Work not found' }, 404)
  }

  const col = await prisma.collection.findUnique({
    where: { ownerId_slug: { ownerId: userId, slug } },
  })
  if (!col) {
    return c.json({ error: 'Collection not found' }, 404)
  }

  const existing = await prisma.collectionItem.findUnique({
    where: { collectionId_articleId: { collectionId: col.id, articleId } },
  })
  if (existing) {
    return c.json({ message: 'Already in collection' }, 200)
  }

  await prisma.collectionItem.create({
    data: { collectionId: col.id, articleId },
  })

  return c.json({ message: 'Added to collection' }, 201)
})

collections.delete('/:slug/items/:articleId', authMiddleware, async (c) => {
  const userId = c.var.userId as string
  const slug = c.req.param('slug')
  const articleId = c.req.param('articleId')

  const col = await prisma.collection.findUnique({
    where: { ownerId_slug: { ownerId: userId, slug } },
  })
  if (!col) {
    return c.json({ error: 'Collection not found' }, 404)
  }

  await prisma.collectionItem.deleteMany({
    where: { collectionId: col.id, articleId },
  })

  return c.json({ message: 'Removed from collection' })
})

export default collections

import { Hono } from 'hono'
import { prisma } from '../lib/prisma'
import { verifyJwt } from '../lib/jwt'

const publicCollections = new Hono()

// GET /api/collections/public/:ownerId/:slug
publicCollections.get('/public/:ownerId/:slug', async (c) => {
  const ownerId = c.req.param('ownerId')
  const slug = c.req.param('slug')

  const col = await prisma.collection.findUnique({
    where: { ownerId_slug: { ownerId, slug } },
    include: {
      items: {
        include: { article: { include: { author: true, category: true, _count: { select: { comments: true } } } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!col) {
    return c.json({ error: 'NOT_FOUND', message: 'Collection not found' }, 404)
  }

  let user: { id: string; role: string } | null = null
  const authHeader = c.req.header('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const payload = verifyJwt(authHeader.slice(7))
    if (payload) {
      user = { id: payload.id as string, role: payload.role as string }
    }
  }

  const isOwner = user?.id === ownerId
  const isAdmin = user?.role === 'ADMIN'

  if (col.visibility === 'PRIVATE' && !isOwner && !isAdmin) {
    return c.json({ error: 'NOT_FOUND', message: 'Collection not found' }, 404)
  }

  const publishedStatuses = ['PUBLISHED']
  const items = col.items
    .filter((item) => isOwner || isAdmin || publishedStatuses.includes(item.article.status))
    .map((item) => ({
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
    }))

  return c.json({
    id: col.id,
    title: col.title,
    slug: col.slug,
    description: col.description,
    cover: col.cover,
    visibility: col.visibility,
    createdAt: col.createdAt.toISOString(),
    items,
  })
})

export default publicCollections

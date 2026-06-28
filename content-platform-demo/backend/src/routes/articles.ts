import { Hono } from 'hono'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authMiddleware, adminMiddleware } from '../middleware/auth'
import { canViewArticle } from '../lib/visibility'

const articles = new Hono()

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function readingTime(content: string): number {
  return Math.ceil(content.split(/\s+/).length / 200)
}

function mapArticle(a: any) {
  return {
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    content: a.content,
    image: a.imageUrl,
    format: a.format,
    aiFreeDeclaration: a.aiFreeDeclaration,
    provenanceStatus: a.provenanceStatus,
    provenanceNote: a.provenanceNote,
    readingTime: readingTime(a.content),
    status: a.status,
    publishAt: a.publishAt?.toISOString() ?? null,
    createdAt: a.createdAt.toISOString(),
    likes: a.likes,
    authorId: a.authorId,
    authorName: a.author?.name ?? '',
    categoryId: a.categoryId,
    categoryName: a.category?.name ?? '',
    commentCount: a._count?.comments ?? 0,
  }
}

// GET /api/articles - public list
articles.get('/', async (c) => {
  const all = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    include: { author: true, category: true, _count: { select: { comments: true } } },
    orderBy: { publishAt: 'desc' },
  })
  return c.json(all.map(mapArticle))
})

// GET /api/articles/:id/versions - version history (auth required)
articles.get('/:id/versions', authMiddleware, async (c) => {
  const id = c.req.param('id')
  const userId = c.var.userId
  const userRole = c.var.userRole

  const article = await prisma.article.findUnique({
    where: { id },
    select: { status: true, authorId: true },
  })
  if (!article || !canViewArticle({ article, user: { id: userId, role: userRole } })) {
    return c.json({ error: 'NOT_FOUND', message: 'Article not found' }, 404)
  }

  const versions = await prisma.articleVersion.findMany({
    where: { articleId: id },
    orderBy: { version: 'desc' },
  })

  return c.json(versions.map((v) => ({
    id: v.id,
    title: `Version ${v.version}`,
    content: v.content,
    changeNote: v.changeNote,
    mediaUrl: v.mediaUrl,
    createdAt: v.createdAt.toISOString(),
    version: v.version,
  })))
})

// GET /api/articles/:slug - public detail
articles.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: true,
      category: true,
      tags: { include: { tag: true } },
      _count: { select: { comments: true } },
    },
  })
  if (!article || article.status !== 'PUBLISHED') {
    return c.json({ error: 'NOT_FOUND', message: 'Article not found' }, 404)
  }

  const relatedArticles = await prisma.article.findMany({
    where: { categoryId: article.categoryId, id: { not: article.id }, status: 'PUBLISHED' },
    take: 4,
    select: { title: true, slug: true, content: true, _count: { select: { comments: true } } },
  })

  return c.json({
    ...mapArticle(article),
    tags: article.tags.map((t) => ({ id: t.tag.id, name: t.tag.name })),
    authorRole: article.author.role === 'ADMIN' ? 'Editor' : 'Author',
    authorArticleCount: await prisma.article.count({ where: { authorId: article.author.id } }),
    relatedArticles: relatedArticles.map((r) => ({
      title: r.title,
      slug: r.slug,
      readingTime: readingTime(r.content),
      commentCount: r._count.comments,
    })),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt,
      author: { '@type': 'Person', name: article.author.name },
      datePublished: article.publishAt?.toISOString(),
      image: article.imageUrl ?? undefined,
    },
  })
})

// POST /api/articles - create (auth required)
articles.post('/', authMiddleware, async (c) => {
  const userId = c.var.userId
  const body = await c.req.json()
  const parsed = z.object({
    title: z.string().min(1),
    format: z.string().default('WRITING'),
    content: z.string().default(''),
    imageUrl: z.string().nullable().optional(),
    aiFreeDeclaration: z.boolean().default(false),
    excerpt: z.string().nullable().optional(),
    categoryId: z.string().min(1),
    tagIds: z.array(z.string()).optional(),
  }).safeParse(body)

  if (!parsed.success) {
    return c.json({ error: 'VALIDATION', message: parsed.error.issues[0]?.message ?? 'Invalid input' }, 400)
  }

  const { title, format, content, imageUrl, aiFreeDeclaration, excerpt, categoryId, tagIds } = parsed.data
  const slug = slugify(title)

  const existing = await prisma.article.findUnique({ where: { slug } })
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug

  const article = await prisma.article.create({
    data: {
      title,
      slug: finalSlug,
      format: format as any,
      excerpt: excerpt || null,
      content: content || '',
      imageUrl: imageUrl || null,
      aiFreeDeclaration,
      status: 'DRAFT',
      authorId: userId,
      categoryId,
      tags: tagIds && tagIds.length > 0
        ? { create: tagIds.map((tagId: string) => ({ tagId })) }
        : undefined,
    },
    include: { author: true, category: true, _count: { select: { comments: true } } },
  })

  return c.json(mapArticle(article), 201)
})

// POST /api/articles/:id/collect - save to collection
articles.post('/:id/collect', authMiddleware, async (c) => {
  const userId = c.var.userId as string
  const articleId = c.req.param('id')

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { status: true },
  })
  if (!article || article.status !== 'PUBLISHED') {
    return c.json({ error: 'NOT_FOUND', message: 'Work not found' }, 404)
  }

  let col = await prisma.collection.findFirst({
    where: { ownerId: userId, slug: 'default' },
  })
  if (!col) {
    col = await prisma.collection.create({
      data: { ownerId: userId, slug: 'default', title: 'Saved Works' },
    })
  }

  const existing = await prisma.collectionItem.findUnique({
    where: { collectionId_articleId: { collectionId: col.id, articleId } },
  })
  if (existing) {
    return c.json({ message: 'Already saved' }, 200)
  }

  await prisma.collectionItem.create({
    data: { collectionId: col.id, articleId },
  })

  return c.json({ message: 'Saved to collection' }, 201)
})

// DELETE /api/articles/:id/collect - remove from collection
articles.delete('/:id/collect', authMiddleware, async (c) => {
  const userId = c.var.userId as string
  const articleId = c.req.param('id')

  const col = await prisma.collection.findFirst({
    where: { ownerId: userId, slug: 'default' },
  })
  if (!col) return c.json({ message: 'Not saved' }, 200)

  await prisma.collectionItem.deleteMany({
    where: { collectionId: col.id, articleId },
  })

  return c.json({ message: 'Removed from collection' })
})

// DELETE /api/articles/:id - admin only
articles.delete('/:id', adminMiddleware, async (c) => {
  const id = c.req.param('id')
  const article = await prisma.article.findUnique({ where: { id }, select: { slug: true } })
  if (!article) {
    return c.json({ error: 'NOT_FOUND', message: 'Article not found' }, 404)
  }
  await prisma.article.delete({ where: { id } })
  return c.json({ ok: true })
})

export default articles

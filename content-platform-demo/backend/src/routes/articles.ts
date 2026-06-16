import { Hono } from 'hono'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authMiddleware, adminMiddleware } from '../middleware/auth'

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

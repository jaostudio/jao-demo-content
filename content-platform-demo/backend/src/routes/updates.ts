import { Hono } from 'hono'
import { prisma } from '../lib/prisma'
import { authMiddleware, adminMiddleware } from '../middleware/auth'

// Mounted at /api to handle transition, update, and versions
const updates = new Hono()

// PUT /api/articles/:id - update article (auth required)
updates.put('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id')
  const userId = c.var.userId
  const userRole = c.var.userRole
  const body = await c.req.json()

  const article = await prisma.article.findUnique({ where: { id } })
  if (!article) {
    return c.json({ error: 'NOT_FOUND', message: 'Article not found' }, 404)
  }

  if (article.authorId !== userId && userRole !== 'ADMIN') {
    return c.json({ error: 'FORBIDDEN', message: 'You do not have permission to edit this article' }, 403)
  }
  if (article.status === 'PENDING_REVIEW' && userRole !== 'ADMIN') {
    return c.json({ error: 'FORBIDDEN', message: 'Article is under review' }, 403)
  }
  if (article.status === 'PUBLISHED' && userRole !== 'ADMIN') {
    return c.json({ error: 'FORBIDDEN', message: 'Published articles cannot be edited' }, 403)
  }

  const slug = body.title ? slugify(body.title) : article.slug
  const existing = await prisma.article.findFirst({ where: { slug, id: { not: id } } })
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug

  await prisma.$transaction([
    prisma.articleVersion.create({
      data: { articleId: id, content: article.content, version: article.versions ? article.versions.length + 1 : 1 },
    }),
    prisma.article.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title, slug: finalSlug }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.excerpt !== undefined && { excerpt: body.excerpt }),
        ...(body.format && { format: body.format }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.aiFreeDeclaration !== undefined && { aiFreeDeclaration: body.aiFreeDeclaration }),
        ...(body.categoryId && { categoryId: body.categoryId }),
        ...(body.tags && {
          tags: {
            deleteMany: {},
            create: body.tags.map((tagId: string) => ({ tagId })),
          },
        }),
      },
    }),
  ])

  const updated = await prisma.article.findUnique({
    where: { id },
    include: { author: true, category: true, _count: { select: { comments: true } } },
  })

  return c.json(mapArticle(updated!))
})

export default updates

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
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
    readingTime: Math.ceil(a.content.split(/\s+/).length / 200),
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

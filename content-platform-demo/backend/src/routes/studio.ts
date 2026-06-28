import { Hono } from 'hono'
import { prisma } from '../lib/prisma'
import { authMiddleware } from '../middleware/auth'

type Variables = { userId: string; userRole: string; userName: string; userEmail: string }

const studio = new Hono<{ Variables: Variables }>()

studio.use('/*', authMiddleware)

studio.get('/stats', async (c) => {
  const userId = c.var.userId as string
  const userRole = c.var.userRole as string
  const isAdmin = userRole === 'ADMIN'

  const where = isAdmin ? {} : { authorId: userId }

  const [totalArticles, draftArticles, pendingReview, publishedArticles, archivedArticles, totalAuthors, totalCategories, totalTags, totalComments, categories] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.count({ where: { ...where, status: 'DRAFT' } }),
    prisma.article.count({ where: { ...where, status: 'PENDING_REVIEW' } }),
    prisma.article.count({ where: { ...where, status: 'PUBLISHED' } }),
    prisma.article.count({ where: { ...where, status: 'ARCHIVED' } }),
    isAdmin ? prisma.author.count() : 1,
    prisma.category.count(),
    prisma.tag.count(),
    isAdmin ? prisma.comment.count() : 0,
    prisma.category.findMany({
      include: { _count: { select: { articles: true } } },
    }),
  ])

  return c.json({
    totalArticles,
    publishedArticles,
    draftArticles,
    pendingReview,
    archivedArticles,
    totalAuthors,
    totalCategories,
    totalTags,
    totalComments,
    categories,
  })
})

studio.get('/articles', async (c) => {
  const userId = c.var.userId as string
  const userRole = c.var.userRole as string
  const isAdmin = userRole === 'ADMIN'

  const articles = await prisma.article.findMany({
    where: isAdmin ? {} : { authorId: userId },
    include: { author: true, category: true, _count: { select: { comments: true } } },
    orderBy: { updatedAt: 'desc' },
  })

  return c.json(articles.map((a) => ({
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
    authorName: a.author.name,
    categoryId: a.categoryId,
    categoryName: a.category.name,
    commentCount: a._count.comments,
  })))
})

export default studio

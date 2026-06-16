import { Hono } from 'hono'
import { prisma } from '../lib/prisma'

const trending = new Hono()

trending.get('/', async (c) => {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    include: { author: true, category: true, _count: { select: { comments: true } } },
    orderBy: [{ likes: 'desc' }, { publishAt: 'desc' }],
    take: 20,
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

export default trending

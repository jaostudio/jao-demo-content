import { Hono } from 'hono'
import { prisma } from '../lib/prisma'

const search = new Hono()

search.get('/', async (c) => {
  const q = c.req.query('q')?.trim()
  if (!q) {
    return c.json([])
  }

  const articles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: q } },
        { excerpt: { contains: q } },
        { content: { contains: q } },
        { author: { name: { contains: q } } },
        { category: { name: { contains: q } } },
      ],
    },
    include: {
      author: true,
      category: true,
      _count: { select: { comments: true } },
    },
    orderBy: { publishAt: 'desc' },
    take: 20,
  })

  return c.json(articles.map((a) => ({
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    authorName: a.author.name,
    categoryName: a.category.name,
    readingTime: Math.ceil(a.content.split(/\s+/).length / 200),
    commentCount: a._count.comments,
    image: a.imageUrl,
    format: a.format,
    aiFreeDeclaration: a.aiFreeDeclaration,
    publishAt: a.publishAt?.toISOString() ?? null,
  })))
})

export default search

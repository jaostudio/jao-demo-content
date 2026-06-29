import { Hono } from 'hono'
import { prisma } from '../lib/prisma'

const authors = new Hono()

authors.get('/:username', async (c) => {
  const username = c.req.param('username')

  const author = await prisma.author.findFirst({
    where: { email: { startsWith: `${username}@` } },
  })

  if (!author) {
    return c.json({ error: 'Author not found' }, 404)
  }

  const articles = await prisma.article.findMany({
    where: { authorId: author.id, status: 'PUBLISHED' },
    include: { category: true, _count: { select: { comments: true } } },
    orderBy: { publishAt: 'desc' },
    take: 50,
  })

  const followerCount = await prisma.follow.count({ where: { followingId: author.id } })
  const followingCount = await prisma.follow.count({ where: { followerId: author.id } })

  return c.json({
    id: author.id,
    name: author.name,
    email: author.email,
    image: author.image,
    bio: author.bio,
    specialty: author.specialty,
    role: author.role,
    createdAt: author.createdAt.toISOString(),
    followerCount,
    followingCount,
    articleCount: articles.length,
    articles: articles.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      image: a.imageUrl,
      format: a.format,
      aiFreeDeclaration: a.aiFreeDeclaration,
      provenanceStatus: a.provenanceStatus,
      readingTime: Math.ceil(a.content.split(/\s+/).length / 200),
      status: a.status,
      publishAt: a.publishAt?.toISOString() ?? null,
      createdAt: a.createdAt.toISOString(),
      likes: a.likes,
      categoryName: a.category.name,
      categorySlug: a.category.slug,
      commentCount: a._count.comments,
    })),
  })
})

export default authors

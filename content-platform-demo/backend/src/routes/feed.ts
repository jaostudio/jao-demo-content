import { Hono } from 'hono'
import { prisma } from '../lib/prisma'
import { verifyJwt } from '../lib/jwt'

const feed = new Hono()

feed.get('/', async (c) => {
  const authHeader = c.req.header('Authorization')
  let userId: string | null = null

  if (authHeader?.startsWith('Bearer ')) {
    const payload = verifyJwt(authHeader.slice(7))
    if (payload) {
      userId = payload.id as string
    }
  }

  if (userId) {
    const follows = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    })

    const followingIds = follows.map((f) => f.followingId)

    if (followingIds.length > 0) {
      const articles = await prisma.article.findMany({
        where: {
          authorId: { in: followingIds },
          status: 'PUBLISHED',
        },
        include: { author: true, category: true, _count: { select: { comments: true } } },
        orderBy: { publishAt: 'desc' },
        take: 50,
      })

      return c.json(articles.map(formatArticle))
    }
  }

  const trending = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    include: { author: true, category: true, _count: { select: { comments: true } } },
    orderBy: [{ likes: 'desc' }, { publishAt: 'desc' }],
    take: 50,
  })

  return c.json(trending.map(formatArticle))
})

function formatArticle(a: {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  imageUrl: string | null
  format: string
  aiFreeDeclaration: boolean
  provenanceStatus: string
  provenanceNote: string | null
  likes: number
  status: string
  publishAt: Date | null
  createdAt: Date
  authorId: string
  author: { id: string; name: string; image: string | null }
  category: { id: string; name: string; slug: string }
  _count: { comments: number }
}) {
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
    readingTime: Math.ceil(a.content.split(/\s+/).length / 200),
    status: a.status,
    publishAt: a.publishAt?.toISOString() ?? null,
    createdAt: a.createdAt.toISOString(),
    likes: a.likes,
    authorId: a.authorId,
    authorName: a.author.name,
    authorImage: a.author.image,
    categoryId: a.category.id,
    categoryName: a.category.name,
    categorySlug: a.category.slug,
    commentCount: a._count.comments,
  }
}

export default feed

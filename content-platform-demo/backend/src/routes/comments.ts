import { Hono } from 'hono'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { canViewArticle } from '../lib/visibility'
import { verifyJwt } from '../lib/jwt'

const comments = new Hono()

const commentSchema = z.object({
  authorName: z.string().min(1, 'Name is required').max(50),
  authorEmail: z.string().email('Enter a valid email').max(100),
  body: z.string().min(1, 'Comment cannot be empty').max(1000),
})

// GET /api/articles/:id/comments
comments.get('/:id/comments', async (c) => {
  const id = c.req.param('id')

  const article = await prisma.article.findUnique({
    where: { id },
    select: { status: true, authorId: true },
  })
  if (!article) {
    return c.json({ error: 'NOT_FOUND', message: 'Article not found' }, 404)
  }

  let user: { id: string; role: string } | null = null
  const authHeader = c.req.header('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const payload = verifyJwt(authHeader.slice(7))
    if (payload) {
      user = { id: payload.id as string, role: payload.role as string }
    }
  }

  if (!canViewArticle({ article, user })) {
    return c.json({ error: 'NOT_FOUND', message: 'Article not found' }, 404)
  }

  const all = await prisma.comment.findMany({
    where: { articleId: id },
    orderBy: { createdAt: 'desc' },
  })
  return c.json(all.map((cm) => ({
    id: cm.id,
    authorName: cm.authorName,
    body: cm.body,
    createdAt: cm.createdAt.toISOString(),
  })))
})

// POST /api/articles/:id/comments
comments.post('/:id/comments', async (c) => {
  const id = c.req.param('id')
  const article = await prisma.article.findUnique({ where: { id, status: 'PUBLISHED' } })
  if (!article) {
    return c.json({ error: 'NOT_FOUND', message: 'Article not found' }, 404)
  }

  const body = await c.req.json()
  const parsed = commentSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: 'VALIDATION', message: parsed.error.issues[0]?.message ?? 'Invalid input' }, 400)
  }

  const comment = await prisma.comment.create({
    data: { articleId: id, ...parsed.data },
  })

  return c.json({
    id: comment.id,
    authorName: comment.authorName,
    body: comment.body,
    createdAt: comment.createdAt.toISOString(),
  }, 201)
})

export default comments

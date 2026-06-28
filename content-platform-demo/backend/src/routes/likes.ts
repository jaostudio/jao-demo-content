import { Hono } from 'hono'
import { prisma } from '../lib/prisma'
import { canEngageWithArticle } from '../lib/visibility'

const likes = new Hono()

// POST /api/articles/:id/like
likes.post('/:id/like', async (c) => {
  const id = c.req.param('id')
  const { action } = await c.req.json() as { action?: 'like' | 'unlike' }

  const article = await prisma.article.findUnique({
    where: { id },
    select: { status: true, likes: true },
  })
  if (!article || !canEngageWithArticle(article)) {
    return c.json({ error: 'NOT_FOUND', message: 'Work not found' }, 404)
  }

  const delta = action === 'unlike' ? -1 : 1
  const likes = Math.max(0, article.likes + delta)

  await prisma.article.update({
    where: { id },
    data: { likes },
  })

  return c.json({ likes })
})

export default likes

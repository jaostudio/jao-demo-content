import { Hono } from 'hono'
import { prisma } from '../lib/prisma'
import { authMiddleware } from '../middleware/auth'

type Variables = { userId: string; userRole: string; userName: string; userEmail: string }

const follows = new Hono<{ Variables: Variables }>()

follows.use('/*', authMiddleware)

follows.post('/:authorId', async (c) => {
  const userId = c.var.userId as string
  const followingId = c.req.param('authorId')

  if (userId === followingId) {
    return c.json({ error: 'Cannot follow yourself' }, 400)
  }

  const target = await prisma.author.findUnique({ where: { id: followingId } })
  if (!target) {
    return c.json({ error: 'Author not found' }, 404)
  }

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: userId, followingId } },
  })
  if (existing) {
    return c.json({ message: 'Already following' }, 200)
  }

  await prisma.follow.create({
    data: { followerId: userId, followingId },
  })

  return c.json({ message: 'Followed' }, 201)
})

follows.delete('/:authorId', async (c) => {
  const userId = c.var.userId as string
  const followingId = c.req.param('authorId')

  await prisma.follow.deleteMany({
    where: { followerId: userId, followingId },
  })

  return c.json({ message: 'Unfollowed' })
})

follows.get('/me', async (c) => {
  const userId = c.var.userId as string

  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    include: { following: { select: { id: true, name: true, image: true } } },
  })

  return c.json(follows.map((f) => ({
    id: f.following.id,
    name: f.following.name,
    image: f.following.image,
    followedAt: f.createdAt.toISOString(),
  })))
})

follows.get('/:authorId', async (c) => {
  const userId = c.var.userId as string
  const targetId = c.req.param('authorId')

  const follow = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: userId, followingId: targetId } },
  })

  return c.json({ isFollowing: !!follow })
})

export default follows


import { Hono } from 'hono'
import { prisma } from '../lib/prisma'

const categories = new Hono()

categories.get('/', async (c) => {
  const all = await prisma.category.findMany({
    include: { _count: { select: { articles: { where: { status: 'PUBLISHED' } } } } },
  })
  return c.json(all)
})

export default categories

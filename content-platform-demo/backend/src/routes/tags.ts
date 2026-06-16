import { Hono } from 'hono'
import { prisma } from '../lib/prisma'

const tags = new Hono()

tags.get('/', async (c) => {
  const all = await prisma.tag.findMany({ orderBy: { name: 'asc' } })
  return c.json(all.map((t) => ({ id: t.id, name: t.name, slug: t.slug })))
})

export default tags

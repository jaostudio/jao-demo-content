import { Hono } from 'hono'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { signJwt } from '../lib/jwt'
import { authMiddleware } from '../middleware/auth'

const auth = new Hono()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const registerSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(6),
})

auth.post('/login', async (c) => {
  const body = await c.req.json()
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: 'VALIDATION', message: parsed.error.issues[0]?.message ?? 'Invalid input' }, 400)
  }

  const user = await prisma.author.findUnique({
    where: { email: parsed.data.email },
  })
  if (!user) {
    return c.json({ error: 'AUTH', message: 'Invalid email or password' }, 401)
  }

  const valid = await bcrypt.compare(parsed.data.password, user.password)
  if (!valid) {
    return c.json({ error: 'AUTH', message: 'Invalid email or password' }, 401)
  }

  const token = signJwt({ id: user.id, role: user.role, name: user.name, email: user.email })

  return c.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, image: user.image },
  })
})

auth.post('/register', async (c) => {
  const body = await c.req.json()
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: 'VALIDATION', message: parsed.error.issues[0]?.message ?? 'Invalid input' }, 400)
  }

  const existing = await prisma.author.findUnique({
    where: { email: parsed.data.email },
  })
  if (existing) {
    return c.json({ error: 'CONFLICT', message: 'Email already registered' }, 409)
  }

  const hashed = await bcrypt.hash(parsed.data.password, 10)
  const user = await prisma.author.create({
    data: { name: parsed.data.name, email: parsed.data.email, password: hashed, role: 'AUTHOR' },
  })

  const token = signJwt({ id: user.id, role: user.role, name: user.name, email: user.email })

  return c.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
})

auth.get('/me', authMiddleware, async (c) => {
  const userId = c.var.userId
  const user = await prisma.author.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, image: true },
  })
  if (!user) {
    return c.json({ error: 'NOT_FOUND', message: 'User not found' }, 404)
  }
  return c.json(user)
})

export default auth

import { createMiddleware } from 'hono/factory'
import { verifyJwt } from '../lib/jwt'

export const authMiddleware = createMiddleware<{
  Variables: {
    userId: string
    userRole: string
    userName: string
    userEmail: string
  }
}>(async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'UNAUTHORIZED', message: 'Missing or invalid token' }, 401)
  }

  const token = authHeader.slice(7)
  const payload = verifyJwt(token)
  if (!payload) {
    return c.json({ error: 'UNAUTHORIZED', message: 'Invalid or expired token' }, 401)
  }

  c.set('userId', payload.id as string)
  c.set('userRole', payload.role as string)
  c.set('userName', payload.name as string)
  c.set('userEmail', payload.email as string)

  await next()
})

export const adminMiddleware = createMiddleware<{
  Variables: {
    userId: string
    userRole: string
    userName: string
    userEmail: string
  }
}>(async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'UNAUTHORIZED', message: 'Missing or invalid token' }, 401)
  }

  const token = authHeader.slice(7)
  const payload = verifyJwt(token)
  if (!payload) {
    return c.json({ error: 'UNAUTHORIZED', message: 'Invalid or expired token' }, 401)
  }

  if (payload.role !== 'ADMIN') {
    return c.json({ error: 'FORBIDDEN', message: 'Admin access required' }, 403)
  }

  c.set('userId', payload.id as string)
  c.set('userRole', payload.role as string)
  c.set('userName', payload.name as string)
  c.set('userEmail', payload.email as string)

  await next()
})

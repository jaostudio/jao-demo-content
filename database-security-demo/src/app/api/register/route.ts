import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validation'
import { assertSameOrigin, assertJsonContentType, getClientIp } from '@/lib/security/request-guards'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: Request) {
  if (process.env.DEMO_REGISTRATION_ENABLED !== 'true') {
    return Response.json({ error: 'registration_disabled' }, { status: 403 })
  }

  try {
    assertSameOrigin(req.headers)
    assertJsonContentType(req.headers)
    const ip = getClientIp(req.headers)
    const rl = await rateLimit(`register:${ip}`, 3, 3600000)
    if (!rl.ok) return Response.json({ error: 'Too many requests' }, { status: 429 })

    const body = await req.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) return Response.json({ error: 'validation_error', message: 'Invalid request payload' }, { status: 400 })
    const { name, email, password } = parsed.data

    const existing = await (prisma as any).user.findUnique({ where: { email } })
    if (existing) return Response.json({ error: 'Email already registered' }, { status: 400 })

    const hashed = await bcrypt.hash(password, 10)
    await (prisma as any).user.create({
      data: { name, email, password: hashed, role: 'ORG_USER' },
    })

    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Registration failed' }, { status: 500 })
  }
}

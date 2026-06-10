import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations/auth'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const rateCheck = checkRateLimit(ip)
  if (!rateCheck.allowed) {
    return Response.json(
      { error: 'Too many attempts. Try again in a minute.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(rateCheck.resetIn / 1000)) },
      },
    )
  }

  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      const first = parsed.error.issues[0]
      return Response.json({ error: first?.message ?? 'Invalid input' }, { status: 400 })
    }

    const { name, email, password } = parsed.data

    const existing = await prisma.author.findUnique({ where: { email } })
    if (existing) {
      return Response.json({ error: 'Email already registered' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)
    await prisma.author.create({
      data: { name, email, password: hashed, role: 'AUTHOR' },
    })

    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Registration failed. Try again later.' }, { status: 500 })
  }
}

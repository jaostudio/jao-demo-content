import { cookies } from 'next/headers'
import { prisma } from './prisma'
import type { SessionUser } from './auth'

const DEMO_MODE = (process.env.DEMO_MODE ?? 'true') === 'true'

export async function getDemoSession(): Promise<SessionUser | null> {
  if (!DEMO_MODE) return null

  const c = await cookies()
  const userEmail = c.get('demo_user_email')?.value

  if (userEmail) {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true, email: true, name: true, role: true, avatarUrl: true, suspended: true },
    })
    if (user && !user.suspended) {
      return { id: user.id, email: user.email, name: user.name, role: user.role, image: user.avatarUrl }
    }
  }

  return null
}

import { cookies } from 'next/headers'

interface SessionAuthor {
  id: string
  name: string
  email: string
  role: string
}

export async function getCurrentAuthor(): Promise<SessionAuthor | null> {
  const cookieStore = await cookies()

  const token = cookieStore.get('likha-token')?.value
  if (token) {
    try {
      const res = await fetch(
        `${process.env.BACKEND_URL ?? 'http://localhost:3001'}/api/auth/me`,
        { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 0 } },
      )
      if (res.ok) {
        return res.json()
      }
    } catch {
      // Backend unreachable — fall through to demo mode
    }
  }

  const demoRole = cookieStore.get('likha-demo-role')?.value
  if (demoRole && ['READER', 'AUTHOR', 'ADMIN'].includes(demoRole)) {
    return {
      id: `demo-${demoRole.toLowerCase()}`,
      name: `Demo ${demoRole.charAt(0) + demoRole.slice(1).toLowerCase()}`,
      email: `demo-${demoRole.toLowerCase()}@demo.local`,
      role: demoRole,
    }
  }

  return null
}

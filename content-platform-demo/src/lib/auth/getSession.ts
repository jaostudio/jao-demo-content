import { getServerSession } from 'next-auth'
import { cookies } from 'next/headers'
import { authOptions } from './auth'

interface SessionAuthor {
  id: string
  name: string
  email: string
  role: string
}

export async function getSession() {
  return getServerSession(authOptions)
}

export async function getCurrentAuthor(): Promise<SessionAuthor | null> {
  const session = await getSession()
  if (session?.user) {
    const user = session.user as { id: string; name: string; email: string; role: string }
    return { id: user.id, name: user.name, email: user.email, role: user.role }
  }

  const cookieStore = await cookies()
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

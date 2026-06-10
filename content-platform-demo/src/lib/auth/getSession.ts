import { getServerSession } from 'next-auth'
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
  if (!session?.user) return null
  const user = session.user as { id: string; name: string; email: string; role: string }
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

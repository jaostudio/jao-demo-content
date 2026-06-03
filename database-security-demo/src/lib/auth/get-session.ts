import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

export async function getSession() {
  return getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session?.user) return null
  const u = session.user as any
  return { id: u.id, name: u.name, email: u.email, role: u.role, orgId: u.orgId }
}

export async function requireRole(...roles: string[]) {
  const user = await getCurrentUser()
  if (!user || (roles.length > 0 && !roles.includes(user.role))) return null
  return user
}

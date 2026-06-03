import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: Role
    } & DefaultSession['user']
  }

  interface User {
    role: Role
  }
}

export type Role = 'admin' | 'manager' | 'user' | 'client'

export const ROLE_HIERARCHY: Record<Role, number> = {
  admin: 100,
  manager: 60,
  user: 30,
  client: 10,
}

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

export function canAccess(
  userRole: Role,
  resourceOwnerId: string,
  currentUserId: string,
): boolean {
  if (hasRole(userRole, 'admin')) return true
  return resourceOwnerId === currentUserId
}

export const AUTH_ERRORS = {
  UNAUTHORIZED: 'You must be signed in to access this resource',
  FORBIDDEN: 'You do not have permission to access this resource',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
} as const

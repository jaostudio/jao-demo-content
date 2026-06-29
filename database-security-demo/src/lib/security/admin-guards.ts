import type { Role } from '@/lib/types/session'

export function assertSystemAdmin(role: Role): void {
  if (role !== 'SYSTEM_ADMIN') {
    throw new Error('Forbidden')
  }
}

export function assertCanDeleteUser(input: {
  currentUserId: string
  targetUserId: string
  targetRole: Role
  systemAdminCount: number
}): void {
  const { currentUserId, targetUserId, targetRole, systemAdminCount } = input

  if (targetUserId === currentUserId) {
    throw new Error('You cannot delete yourself')
  }

  if (targetRole === 'SYSTEM_ADMIN' && systemAdminCount <= 1) {
    throw new Error('Cannot delete the last SYSTEM_ADMIN')
  }
}

export function assertCanDeleteOrganization(input: {
  userCount: number
  documentCount: number
}): void {
  const { userCount, documentCount } = input

  if (userCount > 0) {
    throw new Error('Cannot delete organization with active users')
  }

  if (documentCount > 0) {
    throw new Error('Cannot delete organization with active documents')
  }
}

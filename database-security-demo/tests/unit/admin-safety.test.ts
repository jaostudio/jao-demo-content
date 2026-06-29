import { describe, it, expect } from 'vitest'
import { assertSystemAdmin, assertCanDeleteUser, assertCanDeleteOrganization } from '@/lib/security/admin-guards'

describe('assertSystemAdmin', () => {
  it('SYSTEM_ADMIN passes', () => {
    expect(() => assertSystemAdmin('SYSTEM_ADMIN')).not.toThrow()
  })

  it('ORG_ADMIN throws', () => {
    expect(() => assertSystemAdmin('ORG_ADMIN')).toThrow('Forbidden')
  })

  it('ORG_USER throws', () => {
    expect(() => assertSystemAdmin('ORG_USER')).toThrow('Forbidden')
  })
})

describe('assertCanDeleteUser', () => {
  it('cannot delete self', () => {
    expect(() =>
      assertCanDeleteUser({
        currentUserId: 'user_1',
        targetUserId: 'user_1',
        targetRole: 'ORG_USER',
        systemAdminCount: 5,
      }),
    ).toThrow('You cannot delete yourself')
  })

  it('cannot delete last SYSTEM_ADMIN', () => {
    expect(() =>
      assertCanDeleteUser({
        currentUserId: 'user_1',
        targetUserId: 'user_2',
        targetRole: 'SYSTEM_ADMIN',
        systemAdminCount: 1,
      }),
    ).toThrow('Cannot delete the last SYSTEM_ADMIN')
  })

  it('can delete non-self ORG_USER when admin count > 1', () => {
    expect(() =>
      assertCanDeleteUser({
        currentUserId: 'user_1',
        targetUserId: 'user_2',
        targetRole: 'ORG_USER',
        systemAdminCount: 3,
      }),
    ).not.toThrow()
  })
})

describe('assertCanDeleteOrganization', () => {
  it('cannot delete org with users', () => {
    expect(() =>
      assertCanDeleteOrganization({ userCount: 1, documentCount: 0 }),
    ).toThrow('Cannot delete organization with active users')
  })

  it('cannot delete org with documents', () => {
    expect(() =>
      assertCanDeleteOrganization({ userCount: 0, documentCount: 3 }),
    ).toThrow('Cannot delete organization with active documents')
  })

  it('can delete empty org', () => {
    expect(() =>
      assertCanDeleteOrganization({ userCount: 0, documentCount: 0 }),
    ).not.toThrow()
  })
})

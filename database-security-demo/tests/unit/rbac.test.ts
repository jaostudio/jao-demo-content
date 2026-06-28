import { describe, it, expect } from 'vitest'

type Role = 'SYSTEM_ADMIN' | 'ORG_ADMIN' | 'ORG_USER'

type Access = 'read' | 'create' | 'update' | 'delete'

type Action =
  | 'manage_own_org_documents'
  | 'manage_all_org_documents'
  | 'manage_org_users'
  | 'manage_organizations'
  | 'view_all_audit'
  | 'cross_tenant_read'

const permissionMatrix: Record<Role, Record<Action, boolean>> = {
  ORG_USER: {
    manage_own_org_documents: true,
    manage_all_org_documents: false,
    manage_org_users: false,
    manage_organizations: false,
    view_all_audit: false,
    cross_tenant_read: false,
  },
  ORG_ADMIN: {
    manage_own_org_documents: true,
    manage_all_org_documents: false,
    manage_org_users: false,
    manage_organizations: false,
    view_all_audit: false,
    cross_tenant_read: false,
  },
  SYSTEM_ADMIN: {
    manage_own_org_documents: true,
    manage_all_org_documents: true,
    manage_org_users: true,
    manage_organizations: true,
    view_all_audit: true,
    cross_tenant_read: true,
  },
}

function hasPermission(role: Role, action: Action): boolean {
  return permissionMatrix[role]?.[action] ?? false
}

describe('RBAC permission matrix', () => {
  it('ORG_USER can read and create own-tenant documents', () => {
    expect(hasPermission('ORG_USER', 'manage_own_org_documents')).toBe(true)
  })

  it('ORG_USER cannot manage all org documents', () => {
    expect(hasPermission('ORG_USER', 'manage_all_org_documents')).toBe(false)
  })

  it('ORG_USER cannot manage organizations', () => {
    expect(hasPermission('ORG_USER', 'manage_organizations')).toBe(false)
  })

  it('ORG_USER cannot manage users', () => {
    expect(hasPermission('ORG_USER', 'manage_org_users')).toBe(false)
  })

  it('ORG_USER cannot read cross-tenant', () => {
    expect(hasPermission('ORG_USER', 'cross_tenant_read')).toBe(false)
  })

  it('ORG_USER cannot view all audit', () => {
    expect(hasPermission('ORG_USER', 'view_all_audit')).toBe(false)
  })

  it('ORG_ADMIN can read and create own-tenant documents', () => {
    expect(hasPermission('ORG_ADMIN', 'manage_own_org_documents')).toBe(true)
  })

  it('ORG_ADMIN cannot manage all org documents', () => {
    expect(hasPermission('ORG_ADMIN', 'manage_all_org_documents')).toBe(false)
  })

  it('ORG_ADMIN cannot manage organizations', () => {
    expect(hasPermission('ORG_ADMIN', 'manage_organizations')).toBe(false)
  })

  it('ORG_ADMIN cannot manage users across orgs', () => {
    expect(hasPermission('ORG_ADMIN', 'manage_org_users')).toBe(false)
  })

  it('ORG_ADMIN cannot read cross-tenant', () => {
    expect(hasPermission('ORG_ADMIN', 'cross_tenant_read')).toBe(false)
  })

  it('SYSTEM_ADMIN has all permissions', () => {
    const actions: Action[] = [
      'manage_own_org_documents',
      'manage_all_org_documents',
      'manage_org_users',
      'manage_organizations',
      'view_all_audit',
      'cross_tenant_read',
    ]
    for (const action of actions) {
      expect(hasPermission('SYSTEM_ADMIN', action)).toBe(true)
    }
  })
})

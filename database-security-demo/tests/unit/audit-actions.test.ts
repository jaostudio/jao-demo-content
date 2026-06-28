import { describe, it, expect } from 'vitest'
import { AuditActions } from '@/lib/audit-actions'
import type { AuditAction } from '@/lib/audit-actions'

describe('AuditActions canonical set', () => {
  it('all action values use dot-case format', () => {
    const values = Object.values(AuditActions) as string[]
    for (const v of values) {
      expect(v).toMatch(/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/)
    }
  })

  it('all action values are unique', () => {
    const values = Object.values(AuditActions) as string[]
    expect(new Set(values).size).toBe(values.length)
  })

  it('all action keys are UPPER_SNAKE_CASE', () => {
    const keys = Object.keys(AuditActions)
    for (const k of keys) {
      expect(k).toMatch(/^[A-Z][A-Z0-9_]+$/)
    }
  })

  it('includes auth actions', () => {
    expect(AuditActions.AUTH_LOGIN_SUCCESS).toBe('auth.login_success')
    expect(AuditActions.AUTH_LOGIN_FAILED).toBe('auth.login_failed')
  })

  it('includes document actions', () => {
    expect(AuditActions.DOCUMENT_CREATED).toBe('document.created')
    expect(AuditActions.DOCUMENT_DELETED).toBe('document.deleted')
    expect(AuditActions.DOCUMENT_READ_DENIED).toBe('document.read_denied')
    expect(AuditActions.DOCUMENT_CROSS_TENANT_DENIED).toBe('document.cross_tenant_denied')
  })

  it('does not include document.updated (no edit feature exists)', () => {
    const values = Object.values(AuditActions) as string[]
    expect(values).not.toContain('document.updated')
  })

  it('includes admin actions', () => {
    expect(AuditActions.ADMIN_ORGANIZATION_CREATED).toBe('admin.organization_created')
    expect(AuditActions.ADMIN_ORGANIZATION_DELETED).toBe('admin.organization_deleted')
    expect(AuditActions.ADMIN_USER_CREATED).toBe('admin.user_created')
    expect(AuditActions.ADMIN_USER_DELETED).toBe('admin.user_deleted')
    expect(AuditActions.ADMIN_ACTION_DENIED).toBe('admin.action_denied')
  })

  it('includes security actions', () => {
    expect(AuditActions.SECURITY_CLIENT_ORG_INJECTION_BLOCKED).toBe('security.client_org_injection_blocked')
    expect(AuditActions.SECURITY_AUDIT_TAMPER_DENIED).toBe('security.audit_tamper_denied')
    expect(AuditActions.SECURITY_SETTINGS_UPDATED).toBe('security.settings_updated')
  })

  it('includes security lab simulation actions', () => {
    expect(AuditActions.SECURITY_LAB_CROSS_TENANT_DOCUMENT_ACCESS).toBe('security_lab.cross_tenant_document_access')
    expect(AuditActions.SECURITY_LAB_ADMIN_ONLY_ACTION).toBe('security_lab.admin_only_action')
    expect(AuditActions.SECURITY_LAB_FAKE_ORG_ID_INJECTION).toBe('security_lab.fake_org_id_injection')
    expect(AuditActions.SECURITY_LAB_AUDIT_LOG_TAMPERING).toBe('security_lab.audit_log_tampering')
    expect(AuditActions.SECURITY_LAB_ESCALATED_DOCUMENT_EDIT).toBe('security_lab.escalated_document_edit')
  })

  it('AuditAction type accepts valid actions', () => {
    const valid: AuditAction = 'document.created'
    expect(valid).toBe('document.created')
  })
})

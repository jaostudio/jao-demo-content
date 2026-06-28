import { describe, it, expect } from 'vitest'
import { AuditActions, type AuditAction } from '@/lib/audit-actions'

type SecurityLabSimulation =
  | 'cross-tenant'
  | 'admin-action'
  | 'org-id-injection'
  | 'audit-tamper'
  | 'escalated-edit'

function simulationAuditAction(simulation: SecurityLabSimulation, allowed: boolean): AuditAction {
  const map: Record<SecurityLabSimulation, { allowed: AuditAction; blocked: AuditAction }> = {
    'cross-tenant': {
      allowed: AuditActions.SECURITY_LAB_CROSS_TENANT_DOCUMENT_ACCESS,
      blocked: AuditActions.DOCUMENT_CROSS_TENANT_DENIED,
    },
    'admin-action': {
      allowed: AuditActions.SECURITY_LAB_ADMIN_ONLY_ACTION,
      blocked: AuditActions.ADMIN_ACTION_DENIED,
    },
    'org-id-injection': {
      allowed: AuditActions.SECURITY_LAB_FAKE_ORG_ID_INJECTION,
      blocked: AuditActions.SECURITY_CLIENT_ORG_INJECTION_BLOCKED,
    },
    'audit-tamper': {
      allowed: AuditActions.SECURITY_LAB_AUDIT_LOG_TAMPERING,
      blocked: AuditActions.SECURITY_AUDIT_TAMPER_DENIED,
    },
    'escalated-edit': {
      allowed: AuditActions.SECURITY_LAB_ESCALATED_DOCUMENT_EDIT,
      blocked: AuditActions.ADMIN_ACTION_DENIED,
    },
  }
  return map[simulation][allowed ? 'allowed' : 'blocked']
}

describe('Security lab simulation audit action mapping', () => {
  it('cross-tenant allowed maps to SECURITY_LAB_CROSS_TENANT_DOCUMENT_ACCESS', () => {
    expect(simulationAuditAction('cross-tenant', true)).toBe('security_lab.cross_tenant_document_access')
  })

  it('cross-tenant blocked maps to DOCUMENT_CROSS_TENANT_DENIED', () => {
    expect(simulationAuditAction('cross-tenant', false)).toBe('document.cross_tenant_denied')
  })

  it('admin-action allowed maps to SECURITY_LAB_ADMIN_ONLY_ACTION', () => {
    expect(simulationAuditAction('admin-action', true)).toBe('security_lab.admin_only_action')
  })

  it('admin-action blocked maps to ADMIN_ACTION_DENIED', () => {
    expect(simulationAuditAction('admin-action', false)).toBe('admin.action_denied')
  })

  it('org-id-injection allowed maps to SECURITY_LAB_FAKE_ORG_ID_INJECTION', () => {
    expect(simulationAuditAction('org-id-injection', true)).toBe('security_lab.fake_org_id_injection')
  })

  it('org-id-injection blocked maps to SECURITY_CLIENT_ORG_INJECTION_BLOCKED', () => {
    expect(simulationAuditAction('org-id-injection', false)).toBe('security.client_org_injection_blocked')
  })

  it('audit-tamper blocked maps to SECURITY_AUDIT_TAMPER_DENIED', () => {
    expect(simulationAuditAction('audit-tamper', false)).toBe('security.audit_tamper_denied')
  })

  it('escalated-edit blocked maps to ADMIN_ACTION_DENIED', () => {
    expect(simulationAuditAction('escalated-edit', false)).toBe('admin.action_denied')
  })

  it('escalated-edit allowed maps to SECURITY_LAB_ESCALATED_DOCUMENT_EDIT', () => {
    expect(simulationAuditAction('escalated-edit', true)).toBe('security_lab.escalated_document_edit')
  })
})

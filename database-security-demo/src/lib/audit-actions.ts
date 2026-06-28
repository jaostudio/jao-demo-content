export const AuditActions = {
  AUTH_LOGIN_SUCCESS: 'auth.login_success',
  AUTH_LOGIN_FAILED: 'auth.login_failed',

  DOCUMENT_CREATED: 'document.created',
  DOCUMENT_DELETED: 'document.deleted',
  DOCUMENT_READ_DENIED: 'document.read_denied',
  DOCUMENT_CROSS_TENANT_DENIED: 'document.cross_tenant_denied',

  ADMIN_ORGANIZATION_CREATED: 'admin.organization_created',
  ADMIN_ORGANIZATION_DELETED: 'admin.organization_deleted',
  ADMIN_USER_CREATED: 'admin.user_created',
  ADMIN_USER_DELETED: 'admin.user_deleted',
  ADMIN_ACTION_DENIED: 'admin.action_denied',

  SECURITY_CLIENT_ORG_INJECTION_BLOCKED: 'security.client_org_injection_blocked',
  SECURITY_AUDIT_TAMPER_DENIED: 'security.audit_tamper_denied',
  SECURITY_SETTINGS_UPDATED: 'security.settings_updated',

  // Security Lab simulation events
  SECURITY_LAB_CROSS_TENANT_DOCUMENT_ACCESS: 'security_lab.cross_tenant_document_access',
  SECURITY_LAB_ADMIN_ONLY_ACTION: 'security_lab.admin_only_action',
  SECURITY_LAB_FAKE_ORG_ID_INJECTION: 'security_lab.fake_org_id_injection',
  SECURITY_LAB_AUDIT_LOG_TAMPERING: 'security_lab.audit_log_tampering',
  SECURITY_LAB_ESCALATED_DOCUMENT_EDIT: 'security_lab.escalated_document_edit',
} as const

export type AuditAction = (typeof AuditActions)[keyof typeof AuditActions]

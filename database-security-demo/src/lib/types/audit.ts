import type { AuditAction } from '@/lib/audit-actions'

export type AuditEventRecord = {
  id: string
  action: AuditAction
  entityType: string
  entityId: string | null
  userId: string | null
  userName: string | null
  organizationId: string | null
  metadata: string
  ipAddress: string | null
  causationId: string | null
  createdAt: Date
}

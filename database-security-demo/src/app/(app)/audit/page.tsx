import { getCurrentUser } from '@/lib/auth/get-session'
import { getPrisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { AuditHighlightWrapper } from '@/components/audit-highlight-wrapper'
import { AuditPageNav } from '@/components/audit-page-nav'
import { verifyAuditEvent } from '@/lib/audit/verify'
import { parseAuditLimit } from '@/lib/pagination/audit-pagination'

export const dynamic = 'force-dynamic'

const actionColors: Record<string, 'audit' | 'blocked' | 'admin' | 'tenant' | 'confidential'> = {
  'auth.login_success': 'audit',
  'auth.login_failed': 'confidential',
  'document.created': 'audit',
  'document.deleted': 'blocked',
  'document.read_denied': 'blocked',
  'document.cross_tenant_denied': 'blocked',
  'admin.organization_created': 'admin',
  'admin.organization_deleted': 'blocked',
  'admin.user_created': 'admin',
  'admin.user_deleted': 'blocked',
  'admin.action_denied': 'blocked',
  'security.client_org_injection_blocked': 'blocked',
  'security.audit_tamper_denied': 'blocked',
  'security.settings_updated': 'tenant',
  'security_lab.cross_tenant_document_access': 'audit',
  'security_lab.admin_only_action': 'admin',
  'security_lab.fake_org_id_injection': 'tenant',
  'security_lab.audit_log_tampering': 'blocked',
  'security_lab.escalated_document_edit': 'blocked',
}

const actionLabels: Record<string, string> = {
  'auth.login_success': 'LOGIN_SUCCESS',
  'auth.login_failed': 'LOGIN_FAILED',
  'document.created': 'DOCUMENT_CREATE',
  'document.deleted': 'DOCUMENT_DELETE',
  'document.read_denied': 'READ_DENIED',
  'document.cross_tenant_denied': 'CROSS_TENANT_DENIED',
  'admin.organization_created': 'ORG_CREATE',
  'admin.organization_deleted': 'ORG_DELETE',
  'admin.user_created': 'USER_CREATE',
  'admin.user_deleted': 'USER_DELETE',
  'admin.action_denied': 'ACTION_DENIED',
  'security.client_org_injection_blocked': 'INJECTION_BLOCKED',
  'security.audit_tamper_denied': 'AUDIT_TAMPER_DENIED',
  'security.settings_updated': 'SETTINGS_UPDATED',
  'security_lab.cross_tenant_document_access': 'LAB_CROSS_TENANT',
  'security_lab.admin_only_action': 'LAB_ADMIN_ACTION',
  'security_lab.fake_org_id_injection': 'LAB_ORG_INJECT',
  'security_lab.audit_log_tampering': 'LAB_AUDIT_TAMPER',
  'security_lab.escalated_document_edit': 'LAB_ESCALATED_EDIT',
}

function integrityBadge(status: ReturnType<typeof verifyAuditEvent>) {
  switch (status) {
    case 'VERIFIED':
      return <Badge variant="success">VERIFIED</Badge>
    case 'TAMPERED':
      return <Badge variant="danger">TAMPERED</Badge>
    case 'UNVERIFIED':
      return <Badge variant="tenant">UNVERIFIED</Badge>
  }
}

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ highlight?: string; before?: string; limit?: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect('/signin')
  const { highlight, before, limit: limitStr } = await searchParams
  const prisma = await getPrisma()

  const limit = parseAuditLimit(limitStr)

  const where = user.role === 'SYSTEM_ADMIN' ? {} : { organizationId: user.orgId }

  let rows: any[] = []
  let queryError = false
  try {
    rows = await (prisma as any).auditEvent.findMany({
      where,
      include: { user: { select: { name: true } } },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      ...(before ? { cursor: { id: before }, skip: 1 } : {}),
    })
  } catch {
    queryError = true
  }

  const hasMore = rows.length > limit
  const events = hasMore ? rows.slice(0, limit) : rows
  const nextCursor = hasMore ? events[events.length - 1].id : null

  if (queryError) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-isla-white">Audit Trail</h1>
          <p className="text-sm text-isla-muted mt-1">Could not load audit events. The database may be initializing.</p>
        </div>
        <div className="glass-card-static p-6 text-center">
          <p className="text-sm text-isla-muted">Try again in a moment. If the issue persists, reset the demo data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-isla-white">Audit Trail</h1>
        <p className="text-sm text-isla-muted mt-1">
          Security telemetry. Every mutation and denied access is recorded. Showing {events.length} of {hasMore ? `${limit}+` : events.length} events (page limit: {limit}).
        </p>
      </div>

      <AuditHighlightWrapper highlight={highlight}>
        <div className="space-y-2">
          {events.map((event: any) => {
            const variant = actionColors[event.action] ?? 'tenant'
            const isDenied = event.action.includes('denied')
            const integrity = verifyAuditEvent(event)

            return (
              <div key={event.id} data-event-id={event.id} className="glass-card-static p-3 flex items-start gap-4">
                <div className="text-xs text-isla-muted mono w-16 shrink-0 pt-0.5">
                  {new Date(event.createdAt).toLocaleTimeString()}
                </div>
                <Badge variant={variant}>{actionLabels[event.action] ?? event.action}</Badge>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-isla-white">{event.user?.name ?? 'system'}</span>
                    {event.ipAddress && <span className="text-isla-muted mono">IP: {event.ipAddress}</span>}
                    {event.causationId && (
                      <span className="text-isla-muted mono" title={event.causationId}>
                        cause: {event.causationId.slice(0, 12)}...
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-isla-muted mono mt-0.5">
                    {event.entityType} {event.entityId ? `#${event.entityId.slice(0, 12)}...` : ''}
                  </div>
                </div>
                <div className="shrink-0 text-xs flex flex-col items-end gap-1">
                  <span className={isDenied ? 'text-isla-danger' : 'text-isla-success'}>
                    {isDenied ? 'DENIED' : 'SUCCESS'}
                  </span>
                  {integrityBadge(integrity)}
                </div>
              </div>
            )
          })}
          {events.length === 0 && (
            <p className="text-center text-sm text-isla-muted py-8">No audit events yet.</p>
          )}
        </div>
      </AuditHighlightWrapper>

      <AuditPageNav nextCursor={nextCursor} limit={limit} />
    </div>
  )
}

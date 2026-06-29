import { getCurrentUser } from '@/lib/auth/get-session'
import { getPrisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { StatCard } from '@/components/ui/stat-card'
import { GlassCard } from '@/components/ui/glass-card'
import { StatusPill } from '@/components/ui/status-pill'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/signin')
  const prisma = await getPrisma()

  const [docCount, auditCount, deniedCount, userCount, recentDocs, recentAudit, org] = await Promise.all([
    (prisma as any).document.count({ where: { organizationId: user.orgId ?? undefined } }),
    (prisma as any).auditEvent.count({ where: { organizationId: user.orgId ?? undefined } }),
    (prisma as any).auditEvent.count({
      where: {
        organizationId: user.orgId ?? undefined,
        action: { in: ['document.cross_tenant_denied', 'admin.action_denied', 'document.read_denied'] },
      },
    }),
    (prisma as any).user.count({ where: { organizationId: user.orgId ?? undefined } }),
    (prisma as any).document.findMany({
      where: { organizationId: user.orgId ?? undefined },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    (prisma as any).auditEvent.findMany({
      where: { organizationId: user.orgId ?? undefined },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: true },
    }),
    user.orgId ? (prisma as any).organization.findUnique({ where: { id: user.orgId } }) : null,
  ])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-isla-white">Security Posture Overview</h1>
        <p className="text-sm text-isla-muted mt-1">
          {org?.name ?? 'System'} · {user.role.replace('_', ' ')} · {user.name}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard value={docCount} label="Documents Protected" badge="TENANT-SCOPED" badgeVariant="tenant" />
        <StatCard value={auditCount} label="Audit Events" badge="AUDIT LOGGED" badgeVariant="audit" />
        <StatCard value={deniedCount} label="Denied Attempts" badge="BLOCKED" badgeVariant="blocked" />
        <StatCard value={userCount} label="Users in Tenant" badge="ORG-SCOPED" badgeVariant="rbac" />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <GlassCard hover={false}>
          <StatusPill label="Tenant Boundary" status="success" />
          <div className="mt-1 text-xs text-isla-white font-semibold">ACTIVE</div>
        </GlassCard>
        <GlassCard hover={false}>
          <StatusPill label="RBAC Policy" status="success" />
          <div className="mt-1 text-xs text-isla-white font-semibold">ENFORCED</div>
        </GlassCard>
        <GlassCard hover={false}>
          <StatusPill label="Audit Stream" status="recording" />
          <div className="mt-1 text-xs text-isla-white font-semibold">RECORDING</div>
        </GlassCard>
        <GlassCard hover={false}>
          <StatusPill label="Turso Database" status="success" />
          <div className="mt-1 text-xs text-isla-white font-semibold">CONNECTED</div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <GlassCard hover={false}>
          <h2 className="text-sm font-semibold text-isla-white mb-3">Recent Protected Documents</h2>
          {recentDocs.length > 0 ? (
            <div className="space-y-2">
              {recentDocs.map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between text-xs">
                  <span className="text-isla-white truncate">{doc.title}</span>
                  <span className="text-isla-muted mono">{new Date(doc.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-isla-muted">No documents yet.</p>
          )}
        </GlassCard>

        <GlassCard hover={false}>
          <h2 className="text-sm font-semibold text-isla-white mb-3">Recent Audit Events</h2>
          {recentAudit.length > 0 ? (
            <div className="space-y-2">
              {recentAudit.map((event: any) => (
                <div key={event.id} className="flex items-center justify-between text-xs">
                  <span className="text-isla-muted mono">{event.action}</span>
                  <span className={event.action.includes('denied') ? 'text-isla-danger' : 'text-isla-success'}>
                    {event.action.includes('denied') ? 'DENIED' : 'SUCCESS'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-isla-muted">No audit events yet.</p>
          )}
        </GlassCard>
      </div>

      <GlassCard hover={false}>
        <h2 className="text-sm font-semibold text-isla-white mb-3">Session Information</h2>
        <div className="grid grid-cols-2 gap-4 text-xs">
          {[
            ['User ID', user.id, 'mono'],
            ['Role', user.role, ''],
            ['Organization', org?.name ?? 'None (system)', ''],
            ['Data Scope', user.orgId ? `org:${user.orgId.slice(0, 12)}...` : 'system-wide', 'mono'],
          ].map(([label, value, mono]) => (
            <div key={label as string} className="flex justify-between">
              <span className="text-isla-muted">{label as string}</span>
              <span className={`text-isla-white ${mono as string}`}>{value as string}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

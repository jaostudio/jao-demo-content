import { getCurrentUser } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'

export const dynamic = 'force-dynamic'

export default async function AuditPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/signin')

  const where = user.role === 'SYSTEM_ADMIN' ? {} : { organizationId: user.orgId }
  const events = await (prisma as any).auditEvent.findMany({
    where,
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  const actionColors: Record<string, string> = {
    'document.created': 'bg-green-100 text-green-700',
    'document.deleted': 'bg-red-100 text-red-700',
    'organization.created': 'bg-blue-100 text-blue-700',
    'organization.deleted': 'bg-red-100 text-red-700',
    'user.created': 'bg-purple-100 text-purple-700',
    'user.deleted': 'bg-red-100 text-red-700',
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold">Audit Trail</h1>
        <p className="mb-8 text-sm text-gray-500">
          Complete activity log with causationId chains. Showing last {events.length} events.
        </p>

        <div className="space-y-2">
          {events.map((event: any) => (
            <div key={event.id} className="rounded-lg border p-3 text-sm">
              <div className="flex items-center gap-2">
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${actionColors[event.action] ?? 'bg-gray-100 text-gray-700'}`}>
                  {event.action}
                </span>
                <span className="text-gray-500">{event.entityType}</span>
                {event.entityId && <span className="font-mono text-xs text-gray-400">#{event.entityId.slice(0, 8)}</span>}
              </div>
              <div className="mt-1 flex gap-4 text-xs text-gray-500">
                <span>By {event.user?.name ?? 'system'}</span>
                <span>{new Date(event.createdAt).toLocaleString()}</span>
                {event.ipAddress && <span>IP: {event.ipAddress}</span>}
                {event.causationId && <span className="font-mono">cause: {event.causationId.slice(0, 16)}...</span>}
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-8">No audit events yet.</p>
          )}
        </div>
      </main>
    </>
  )
}

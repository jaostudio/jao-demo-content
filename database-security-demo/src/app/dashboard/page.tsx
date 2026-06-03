import { getCurrentUser } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/signin')

  const [docCount, auditCount, org] = await Promise.all([
    (prisma as any).document.count({ where: { organizationId: user.orgId ?? undefined } }),
    (prisma as any).auditEvent.count({ where: { organizationId: user.orgId ?? undefined } }),
    user.orgId ? (prisma as any).organization.findUnique({ where: { id: user.orgId } }) : null,
  ])

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mb-8 text-sm text-gray-500">
          {org?.name ?? 'System'} · {user.role.replace('_', ' ')} · {user.name}
        </p>

        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="rounded-lg border p-4">
            <p className="text-2xl font-bold">{docCount}</p>
            <p className="text-sm text-gray-500">Documents</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-2xl font-bold">{auditCount}</p>
            <p className="text-sm text-gray-500">Audit Events</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-2xl font-bold">
              {user.role === 'SYSTEM_ADMIN' ? 'Full Access' : org ? 'Scoped' : 'None'}
            </p>
            <p className="text-sm text-gray-500">Data Access</p>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold">Session Info</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">User ID</dt><dd className="font-mono">{user.id}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Role</dt><dd>{user.role}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Organization</dt><dd>{org?.name ?? 'None (system)'}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Data Scope</dt><dd>{user.orgId ? `org:${user.orgId.slice(0, 8)}...` : 'system-wide'}</dd></div>
          </dl>
        </div>
      </main>
    </>
  )
}

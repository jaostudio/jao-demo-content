import { getCurrentUser } from '@/lib/auth/get-session'
import { getPrisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { createOrgUser, deleteUser } from '@/lib/actions'
import { Badge } from '@/components/ui/badge'
import { GlassCard } from '@/components/ui/glass-card'
import { ConfirmSubmitButton } from '@/components/confirm-submit-button'

export const dynamic = 'force-dynamic'

const roleVariant: Record<string, 'admin' | 'rbac' | 'tenant'> = {
  SYSTEM_ADMIN: 'admin',
  ORG_ADMIN: 'rbac',
  ORG_USER: 'tenant',
}

export default async function AdminUsersPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'SYSTEM_ADMIN') redirect('/dashboard')
  const prisma = await getPrisma()

  const [users, orgs] = await Promise.all([
    (prisma as any).user.findMany({
      include: { organization: true, _count: { select: { documents: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    (prisma as any).organization.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-isla-white">Users</h1>
        <p className="text-sm text-isla-muted mt-1">System administration. Manage users across organizations.</p>
      </div>

      <GlassCard hover={false}>
        <h2 className="text-sm font-semibold text-isla-white mb-3">Create User</h2>
        <form action={createOrgUser} className="flex flex-wrap gap-3">
          <input name="name" placeholder="Name" required
            className="flex-1 min-w-[150px] rounded-lg bg-isla-volcanic border border-isla-border px-3 py-2 text-sm text-isla-white placeholder:text-isla-muted focus:outline-none focus:border-isla-amethyst" />
          <input name="email" type="email" placeholder="Email" required
            className="flex-1 min-w-[200px] rounded-lg bg-isla-volcanic border border-isla-border px-3 py-2 text-sm text-isla-white placeholder:text-isla-muted focus:outline-none focus:border-isla-amethyst" />
          <select name="role" required
            className="rounded-lg bg-isla-volcanic border border-isla-border px-3 py-2 text-sm text-isla-white focus:outline-none focus:border-isla-amethyst">
            <option value="ORG_USER">ORG_USER</option>
            <option value="ORG_ADMIN">ORG_ADMIN</option>
            <option value="SYSTEM_ADMIN">SYSTEM_ADMIN</option>
          </select>
          <select name="orgId"
            className="rounded-lg bg-isla-volcanic border border-isla-border px-3 py-2 text-sm text-isla-white focus:outline-none focus:border-isla-amethyst">
            <option value="">No org</option>
            {orgs.map((o: any) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
          <button type="submit" className="rounded-lg bg-isla-amethyst px-4 py-2 text-sm text-white hover:bg-isla-amethyst/90 transition-colors">Create</button>
        </form>
        <p className="mt-2 text-xs text-isla-muted">Default password: password123</p>
      </GlassCard>

      <div className="space-y-2">
        {users.map((u: any) => (
          <GlassCard key={u.id} hover={false}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-isla-white">{u.name}</div>
                <div className="text-xs text-isla-muted">{u.email}</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={roleVariant[u.role] ?? 'tenant'}>{u.role}</Badge>
                <span className="text-xs text-isla-muted">{u.organization?.name ?? '-'}</span>
                <span className="text-xs text-isla-muted">{u._count.documents} docs</span>
                {u.role !== 'SYSTEM_ADMIN' && (
                  <form action={deleteUser.bind(null, u.id)}>
                    <ConfirmSubmitButton label="Delete" confirmMessage={`Delete user ${u.name}?`} />
                  </form>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

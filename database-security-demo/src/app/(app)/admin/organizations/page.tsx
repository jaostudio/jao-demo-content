import { getCurrentUser } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { createOrganization, deleteOrganization } from '@/lib/actions'
import { GlassCard } from '@/components/ui/glass-card'
import { ConfirmSubmitButton } from '@/components/confirm-submit-button'

export const dynamic = 'force-dynamic'

export default async function AdminOrganizationsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'SYSTEM_ADMIN') redirect('/dashboard')

  const orgs = await (prisma as any).organization.findMany({
    include: { _count: { select: { users: true, documents: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-isla-white">Organizations</h1>
        <p className="text-sm text-isla-muted mt-1">System administration — manage tenants.</p>
      </div>

      <GlassCard hover={false}>
        <h2 className="text-sm font-semibold text-isla-white mb-3">Create Organization</h2>
        <form action={createOrganization} className="flex gap-3">
          <input name="name" placeholder="Organization name" required
            className="flex-1 rounded-lg bg-isla-volcanic border border-isla-border px-3 py-2 text-sm text-isla-white placeholder:text-isla-muted focus:outline-none focus:border-isla-amethyst" />
          <button type="submit" className="rounded-lg bg-isla-amethyst px-4 py-2 text-sm text-white hover:bg-isla-amethyst/90 transition-colors">Create</button>
        </form>
      </GlassCard>

      <div className="space-y-3">
        {orgs.map((org: any) => (
          <GlassCard key={org.id} hover={false}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-isla-white">{org.name}</div>
                <div className="text-xs text-isla-muted mono mt-0.5">{org.slug} · {org._count.users} users · {org._count.documents} documents</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-isla-muted">{new Date(org.createdAt).toLocaleDateString()}</span>
                <form action={deleteOrganization.bind(null, org.id)}>
                  <ConfirmSubmitButton label="Delete" confirmMessage={`Delete organization ${org.name}? This will fail if org has users or documents.`} />
                </form>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

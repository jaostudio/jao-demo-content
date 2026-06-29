import { getCurrentUser } from '@/lib/auth/get-session'
import { getPrisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/signin')
  if (!user.orgId && user.role !== 'SYSTEM_ADMIN') redirect('/dashboard')
  const prisma = await getPrisma()

  const settings = user.orgId ? await (prisma as any).securitySetting.findMany({
    where: { organizationId: user.orgId },
  }) : []

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-isla-white">Organization Settings</h1>
        <p className="text-sm text-isla-muted mt-1">Security configuration for your tenant.</p>
      </div>

      {!user.orgId ? (
        <p className="text-sm text-isla-muted py-8 text-center">No organization scope for system-level accounts. Sign in as an organization admin to view settings.</p>
      ) : (
        <div className="space-y-3 max-w-xl">
          {settings.map((s: any) => (
            <GlassCard key={s.id} hover={false}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-isla-white">{s.key.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-isla-muted">Updated {new Date(s.updatedAt).toLocaleDateString()}</p>
                </div>
                <Badge variant={s.value === 'true' ? 'audit' : 'tenant'}>{s.value}</Badge>
              </div>
            </GlassCard>
          ))}
          {settings.length === 0 && (
            <p className="text-center text-sm text-isla-muted py-8">No security settings configured.</p>
          )}
        </div>
      )}
    </div>
  )
}

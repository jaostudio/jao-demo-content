import { getCurrentUser } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/signin')
  if (!user.orgId) redirect('/dashboard')

  const settings = await (prisma as any).securitySetting.findMany({
    where: { organizationId: user.orgId },
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-isla-white">Organization Settings</h1>
        <p className="text-sm text-isla-muted mt-1">Security configuration for your tenant.</p>
      </div>

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
    </div>
  )
}

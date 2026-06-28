import { getCurrentUser } from '@/lib/auth/get-session'
import { redirect } from 'next/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'
import { SecurityLabCard } from '@/components/security-lab-card'

export const dynamic = 'force-dynamic'

const simulations = [
  {
    title: 'Cross-Tenant Document Access',
    description: 'Attempt to load a TalaPay Cooperative document while signed in as a Luntian Health Network user.',
    type: 'cross-tenant',
    intent: 'Try reading a document from another tenant.',
  },
  {
    title: 'Admin-Only Action',
    description: 'Attempt to create a new organization as a non-SYSTEM_ADMIN user.',
    type: 'admin-action',
    intent: 'Try performing a system administration action without permission.',
  },
  {
    title: 'Fake organizationId Injection',
    description: 'Submit a document create request with organizationId set to another tenant.',
    type: 'org-id-injection',
    intent: 'Try bypassing tenant isolation by injecting a different org ID.',
  },
  {
    title: 'Audit Log Tampering',
    description: 'Attempt to update an existing audit event to modify the record.',
    type: 'audit-tamper',
    intent: 'Try modifying the immutable audit trail.',
  },
  {
    title: 'Escalated Document Edit',
    description: 'Attempt to edit a document without the ORG_ADMIN or SYSTEM_ADMIN role.',
    type: 'escalated-edit',
    intent: 'Try editing a document without the required role.',
  },
]

export default async function SecurityLabPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/signin')

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-isla-white">Security Lab</h1>
        <p className="text-sm text-isla-muted mt-1">
          Test how IslaVault handles unauthorized database access attempts.
          Each simulation makes a real server call and shows the enforcement chain.
        </p>
      </div>

      <GlassCard hover={false}>
        <div className="flex items-center gap-4 flex-wrap">
          <Badge variant="rbac">{user.role}</Badge>
          <span className="text-xs text-isla-muted">
            Tenant: {user.orgId ? `${user.orgId.slice(0, 12)}...` : 'Global (SYSTEM_ADMIN)'}
          </span>
          <Badge variant={user.orgId ? 'tenant' : 'admin'}>
            {user.orgId ? 'TENANT-SCOPED' : 'GLOBAL ACCESS'}
          </Badge>
        </div>
        <p className="mt-3 text-xs text-isla-muted">
          {user.role === 'SYSTEM_ADMIN'
            ? 'You are signed in as SYSTEM_ADMIN. Some simulations will show ALLOWED because your role has global access. Try switching to an ORG_USER account to see blocking in action.'
            : 'Your requests are scoped to your tenant. Simulations will demonstrate cross-tenant blocking, RBAC enforcement, and injection protection.'}
        </p>
      </GlassCard>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {simulations.map((sim) => (
          <SecurityLabCard key={sim.type} {...sim} />
        ))}
      </div>
    </div>
  )
}

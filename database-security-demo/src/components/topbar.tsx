'use client'

import { useSession, signOut } from 'next-auth/react'
import { Badge } from '@/components/ui/badge'
import { StatusPill } from '@/components/ui/status-pill'
import { DemoSwitcher } from '@/components/demo-switcher'
import { useSecurityProof } from '@/components/security-proof-panel'
import { SandboxIndicator } from '@/components/sandbox-indicator'
import { ShieldCheck } from 'lucide-react'

export function Topbar({ sandboxMode = false }: { sandboxMode?: boolean }) {
  const { data: session } = useSession()
  const user = session?.user as any
  const { open } = useSecurityProof()

  if (!user) return null

  const roleBadgeVariant = user.role === 'SYSTEM_ADMIN' ? 'admin' : user.role === 'ORG_ADMIN' ? 'rbac' : 'tenant'

  return (
    <header className="h-14 border-b border-isla-border bg-isla-glass/60 backdrop-blur-md flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <StatusPill label="Tenant Scope Active" status="success" />
        {user.orgId && (
          <span className="text-xs text-isla-muted mono">
            Scope: {user.orgId.slice(0, 12)}...
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Badge variant={roleBadgeVariant}>{user.role}</Badge>
        <button
          onClick={open}
          className="flex items-center gap-1.5 rounded-lg bg-isla-amethyst/10 px-3 py-1.5 text-xs font-medium text-isla-amethyst hover:bg-isla-amethyst/20 transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Security Proof
        </button>
        {sandboxMode && <SandboxIndicator />}
        <DemoSwitcher />
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-xs text-isla-muted hover:text-isla-coral transition-colors"
        >
          Sign Out
        </button>
      </div>
    </header>
  )
}

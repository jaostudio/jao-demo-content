'use client'

import { useSession, signOut } from 'next-auth/react'
import { Badge } from '@/components/ui/badge'
import { StatusPill } from '@/components/ui/status-pill'
import { DemoSwitcher } from '@/components/demo-switcher'

export function Topbar() {
  const { data: session } = useSession()
  const user = session?.user as any

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

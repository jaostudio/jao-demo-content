'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { StatusPill } from '@/components/ui/status-pill'
import { DEMO_PASSWORD } from '@/lib/demo-accounts'
import type { DemoAccount } from '@/lib/demo-accounts'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

type Props = DemoAccount

function badgeVariant(role: DemoAccount['role']) {
  if (role === 'SYSTEM_ADMIN') return 'admin'
  if (role === 'ORG_ADMIN') return 'rbac'
  return 'tenant'
}

export function DemoIdentityCard({ name, email, role, tenant, access }: Props) {
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    setLoading(true)
    await signIn('credentials', {
      email,
      password: DEMO_PASSWORD,
      callbackUrl: '/dashboard',
    })
  }

  return (
    <div className="glass-card p-5 flex flex-col gap-3 min-h-0">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-isla-white truncate">{name}</div>
          <div className="text-xs text-isla-muted mono mt-0.5 truncate">{email}</div>
        </div>
        <Badge variant={badgeVariant(role)} className="shrink-0">{role}</Badge>
      </div>
      <div className="text-xs text-isla-muted">
        <span className="text-isla-pacific">Tenant:</span> {tenant}
      </div>
      <div className="text-xs text-isla-muted">
        <span className="text-isla-violet">Access:</span> {access}
      </div>
      <StatusPill label="Tenant Scope Active" status="success" />
      <div className="mt-auto pt-1">
        <button
          onClick={handleSignIn}
          disabled={loading}
          className={cn(
            'w-full px-4 py-2 rounded-lg text-sm font-medium transition-all',
            'bg-isla-amethyst text-white hover:bg-isla-amethyst/90',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {loading ? 'Signing in...' : `Sign In as ${name}`}
        </button>
      </div>
    </div>
  )
}

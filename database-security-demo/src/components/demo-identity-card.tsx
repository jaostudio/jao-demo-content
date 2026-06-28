'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { StatusPill } from '@/components/ui/status-pill'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

interface DemoIdentityCardProps {
  name: string
  email: string
  role: string
  tenant: string
  access: string
  roleVariant?: 'tenant' | 'rbac' | 'admin'
}

export function DemoIdentityCard({ name, email, role, tenant, access, roleVariant = 'tenant' }: DemoIdentityCardProps) {
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    setLoading(true)
    await signIn('credentials', {
      email,
      password: 'password123',
      callbackUrl: '/dashboard',
    })
  }

  return (
    <div className="glass-card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-isla-white">{name}</div>
          <div className="text-xs text-isla-muted mono mt-0.5">{email}</div>
        </div>
        <Badge variant={roleVariant}>{role}</Badge>
      </div>
      <div className="text-xs text-isla-muted">
        <span className="text-isla-pacific">Tenant:</span> {tenant}
      </div>
      <div className="text-xs text-isla-muted">
        <span className="text-isla-violet">Access:</span> {access}
      </div>
      <StatusPill label="Tenant Scope Active" status="success" />
      <button
        onClick={handleSignIn}
        disabled={loading}
        className={cn(
          'mt-1 w-full px-4 py-2 rounded-lg text-sm font-medium transition-all',
          'bg-isla-amethyst text-white hover:bg-isla-amethyst/90',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      >
        {loading ? 'Signing in...' : `Sign In as ${name.split(' ')[0]}`}
      </button>
    </div>
  )
}

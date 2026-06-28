import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type BadgeVariant = 'tenant' | 'rbac' | 'audit' | 'blocked' | 'confidential' | 'admin' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  tenant: 'badge-tenant',
  rbac: 'badge-rbac',
  audit: 'badge-audit',
  blocked: 'badge-blocked',
  confidential: 'badge-confidential',
  admin: 'badge-admin',
  success: 'badge-audit',
  warning: 'badge-confidential',
  danger: 'badge-blocked',
  info: 'badge-tenant',
}

export function Badge({ children, variant = 'tenant', className }: BadgeProps) {
  return (
    <span className={cn('badge text-xs', variantClasses[variant], className)}>
      {children}
    </span>
  )
}

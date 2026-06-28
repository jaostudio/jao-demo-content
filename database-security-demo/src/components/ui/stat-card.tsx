import { cn } from '@/lib/utils'
import { Badge } from './badge'
import type { ReactNode } from 'react'

interface StatCardProps {
  value: string | number
  label: string
  badge?: string
  badgeVariant?: 'tenant' | 'rbac' | 'audit' | 'blocked' | 'confidential' | 'admin'
  icon?: ReactNode
  className?: string
}

export function StatCard({ value, label, badge, badgeVariant = 'tenant', icon, className }: StatCardProps) {
  return (
    <div className={cn('glass-card-static p-5 flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        {icon && <span className="text-isla-muted">{icon}</span>}
        {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
      </div>
      <span className="text-2xl font-bold tracking-tight text-isla-white">{value}</span>
      <span className="text-sm text-isla-muted">{label}</span>
    </div>
  )
}

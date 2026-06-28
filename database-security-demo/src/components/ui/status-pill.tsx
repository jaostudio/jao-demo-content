import { cn } from '@/lib/utils'

type StatusType = 'success' | 'danger' | 'warning' | 'info' | 'recording'

interface StatusPillProps {
  label: string
  status?: StatusType
  className?: string
  dotOnly?: boolean
}

const dotClasses: Record<StatusType, string> = {
  success: 'status-dot-success',
  danger: 'status-dot-danger',
  warning: 'status-dot-warning',
  info: 'status-dot-info',
  recording: 'status-dot-recording',
}

export function StatusPill({ label, status = 'info', className, dotOnly }: StatusPillProps) {
  if (dotOnly) {
    return <span className={cn('status-dot', dotClasses[status], className)} title={label} />
  }

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs text-isla-muted', className)}>
      <span className={cn('status-dot', dotClasses[status])} />
      {label}
    </span>
  )
}

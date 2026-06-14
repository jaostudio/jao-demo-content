import type { HTMLAttributes } from 'react'

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-surface-alt text-text-secondary border-border',
  primary: 'bg-primary-light text-primary border-primary/30',
  secondary: 'bg-secondary-light text-secondary-dark border-secondary/30',
  accent: 'bg-accent-light text-accent-dark border-accent/30',
  success: 'bg-success-light text-green-800 border-success/30',
  warning: 'bg-warning-light text-amber-800 border-warning/30',
  danger: 'bg-danger-light text-red-800 border-danger/30',
}

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[999px] px-2.5 py-0.5 text-[11px] font-medium border ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

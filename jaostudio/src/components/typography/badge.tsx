import { cn } from '@/lib/cn'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'accent'
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
        variant === 'default'
          ? 'border border-border bg-surface-hover text-text-tertiary'
          : 'min-w-[5rem] justify-center bg-accent-subtle text-accent',
        className,
      )}
    >
      {children}
    </span>
  )
}

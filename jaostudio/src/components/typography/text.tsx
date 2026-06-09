import { cn } from '@/lib/cn'

interface TextProps {
  children: React.ReactNode
  className?: string
  variant?: 'body' | 'small' | 'label'
  muted?: boolean
}

export function Text({ children, className, variant = 'body', muted }: TextProps) {
  return (
    <p
      className={cn(
        'leading-relaxed',
        {
          'text-base md:text-lg': variant === 'body',
          'text-sm': variant === 'small',
          'text-xs font-medium uppercase tracking-widest': variant === 'label',
        },
        muted ? 'text-text-tertiary' : 'text-text-primary',
        className,
      )}
    >
      {children}
    </p>
  )
}

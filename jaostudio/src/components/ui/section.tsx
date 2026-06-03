import { cn } from '@/lib/cn'

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  glow?: boolean
  variant?: 'default' | 'alt' | 'cinema'
  density?: 'normal' | 'compact' | 'roomy'
}

const containerWidths: Record<string, string> = {
  default: 'max-w-7xl',
  alt: 'max-w-7xl',
  cinema: 'max-w-screen-2xl',
}

export function Section({
  children,
  className,
  id,
  glow,
  variant = 'default',
  density = 'compact',
}: SectionProps) {
  const verticalPadding =
    density === 'compact'
      ? 'py-[var(--section-py-compact)]'
      : density === 'roomy'
        ? 'py-[var(--section-py-roomy)]'
        : 'py-[var(--section-py)]'

  return (
    <section
      id={id}
      className={cn(
        'relative',
        verticalPadding,
        variant === 'alt' && 'bg-bg-secondary',
        className,
      )}
    >
      {glow && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(124,58,237,0.08), transparent 60%)',
          }}
        />
      )}
      <div className={cn('mx-auto w-full px-6 md:px-8 lg:px-12', containerWidths[variant])}>
        {children}
      </div>
    </section>
  )
}

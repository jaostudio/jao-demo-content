import { cn } from '@/lib/cn'

interface LayeredFrameProps {
  children: React.ReactNode
  className?: string
  fullBleed?: boolean
  glow?: boolean
}

export function LayeredFrame({ children, className, fullBleed = false, glow = false }: LayeredFrameProps) {
  return (
    <div className={cn('relative isolate', fullBleed ? 'w-full' : 'mx-auto w-full max-w-7xl px-6 md:px-8 lg:px-12', className)}>
      {glow && (
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(124,58,237,0.10), transparent 35%), radial-gradient(circle at 80% 0%, rgba(217,119,6,0.08), transparent 28%)',
          }}
        />
      )}

      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-accent-soft to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-accent-soft to-transparent"
        aria-hidden="true"
      />

      {children}
    </div>
  )
}

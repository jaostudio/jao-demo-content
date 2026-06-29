import { LikhaLogo } from '@/components/brand/likha-logo'

interface AuthShellProps {
  children: React.ReactNode
  demoAccess?: React.ReactNode
  subtitle?: string
}

export function AuthShell({ children, demoAccess, subtitle }: AuthShellProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ backgroundColor: 'var(--brand-bg)' }}>
      <div className="relative w-full max-w-[640px]">
        {/* Ghosted Process Mark watermark */}
        <div className="pointer-events-none absolute -right-8 -top-8 opacity-[0.04] hidden md:block">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--brand-ink)' }}>
            <path d="M5 5v14h14" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="17.5" y1="6.5" x2="8.5" y2="15.5" strokeLinecap="round" />
            <circle cx="19.5" cy="19.5" r="1.5" fill="currentColor" />
          </svg>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <LikhaLogo variant="lockup" size="md" />
          </div>
          {subtitle && (
            <p className="text-[13px] mt-1" style={{ color: 'var(--brand-muted)' }}>{subtitle}</p>
          )}
        </div>

        {/* Content grid */}
        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-3">
            <div className="studio-frame rounded-xl p-6" style={{ border: '1px solid var(--brand-border)', backgroundColor: 'var(--brand-surface-raised)' }}>
              {children}
            </div>
          </div>
          {demoAccess && (
            <div className="md:col-span-2">
              {demoAccess}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

type WorkPosterVariant = 'feed' | 'featured' | 'compact' | 'mosaic'

interface WorkPosterProps {
  title: string
  authorName: string
  category?: string
  provenanceStatus?: string
  variant?: WorkPosterVariant
}

function titleFragment(title: string): string {
  const words = title.split(/\s+/)
  if (words.length <= 3) return title
  return words.slice(0, 2).join(' ')
}

function getSignalColor(status?: string): string | null {
  if (!status || status === 'UNDECLARED') return null
  if (status === 'LIVE' || status === 'PUBLISHED') return 'var(--color-reactor-green)'
  if (status === 'IN_REVIEW' || status === 'PENDING') return 'var(--color-voltage-pink)'
  return null
}

export function WorkPoster({ title, authorName, category, provenanceStatus, variant = 'feed' }: WorkPosterProps) {
  const fragment = titleFragment(title)
  const signalColor = getSignalColor(provenanceStatus)
  const isCompact = variant === 'compact' || variant === 'mosaic'

  return (
    <div
      className={`relative w-full overflow-hidden ${variant === 'featured' ? 'aspect-[16/9]' : isCompact ? 'aspect-[3/2]' : 'aspect-[4/3]'}`}
      style={{ backgroundColor: 'var(--brand-surface)' }}
    >
      {/* Scanline texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--brand-ink) 2px, var(--brand-ink) 3px)',
      }} />

      {/* Brand grid watermark */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(var(--brand-border) 1px, transparent 1px), linear-gradient(90deg, var(--brand-border) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Studio frame */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-3 top-3 h-4 w-4 border-l border-t" style={{ borderColor: 'var(--brand-border)' }} />
        <div className="absolute bottom-3 right-3 h-4 w-4 border-b border-r" style={{ borderColor: 'var(--brand-border)' }} />
      </div>

      {/* Large title fragment */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <span
          className={`font-bold leading-[1.05] tracking-[-0.04em] text-center select-none ${
            isCompact ? 'text-[28px]' : 'text-[42px]'
          }`}
          style={{ color: 'var(--brand-ink)', opacity: 0.85 }}
        >
          {fragment}
        </span>
      </div>

      {/* Top-left: small category stamp */}
      {category && (
        <span className="absolute left-3 top-3 text-[9px] font-medium uppercase tracking-[0.12em] px-1.5 py-0.5 rounded"
          style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand-muted)' }}
        >
          {category}
        </span>
      )}

      {/* Bottom-left: small Process Mark */}
      <div className="absolute bottom-3 left-3 opacity-30">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--brand-ink)' }}>
          <path d="M5 5v14h14" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="17.5" y1="6.5" x2="8.5" y2="15.5" strokeLinecap="round" />
          <circle cx="19.5" cy="19.5" r="1.5" fill="currentColor" />
        </svg>
      </div>

      {/* Bottom-right: signal dot if live/process */}
      {signalColor && (
        <div className="absolute bottom-3 right-3 flex items-center gap-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: signalColor }} />
        </div>
      )}
    </div>
  )
}

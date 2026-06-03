import { cn } from '@/lib/cn'

interface LogoProps {
  className?: string
  size?: number
  showMark?: boolean
}

export function Logo({ className, size = 28, showMark = true }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      {showMark && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
          <circle cx="14" cy="14" r="4.5" fill="#7C3AED" opacity="0.9" />
          <circle cx="5" cy="9" r="2.5" fill="#7C3AED" opacity="0.5" />
          <circle cx="22" cy="8" r="2" fill="#D97706" opacity="0.6" />
          <circle cx="21" cy="20" r="3" fill="#7C3AED" opacity="0.35" />
          <circle cx="8" cy="21" r="1.5" fill="#D97706" opacity="0.4" />
          <line x1="6.8" y1="10.5" x2="12" y2="13" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <line x1="16.5" y1="12" x2="20.5" y2="9" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <line x1="16" y1="16" x2="19" y2="18.5" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <line x1="10" y1="16.5" x2="7.5" y2="19.5" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        </svg>
      )}
      <span className="text-[var(--text-body)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
        JAOstudio
      </span>
    </span>
  )
}

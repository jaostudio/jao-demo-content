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
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="logoStarGlow" cx="50%" cy="50%" r="35%">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#7C3AED" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
            </radialGradient>
            <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Starfield */}
          <circle cx="80" cy="72" r="1.5" fill="currentColor" opacity="0.2" />
          <circle cx="420" cy="56" r="1" fill="currentColor" opacity="0.15" />
          <circle cx="64" cy="400" r="1.2" fill="currentColor" opacity="0.18" />
          <circle cx="440" cy="432" r="1" fill="currentColor" opacity="0.15" />
          <circle cx="160" cy="48" r="0.8" fill="#D97706" opacity="0.25" />
          <circle cx="384" cy="480" r="0.8" fill="#D97706" opacity="0.2" />

          {/* Radial glow */}
          <circle cx="256" cy="256" r="180" fill="url(#logoStarGlow)" />

          {/* Orbital rings */}
          <ellipse cx="256" cy="256" rx="130" ry="55" transform="rotate(-20 256 256)"
            stroke="currentColor" strokeWidth="1.5" opacity="0.12" fill="none" />
          <ellipse cx="256" cy="256" rx="190" ry="80" transform="rotate(15 256 256)"
            stroke="currentColor" strokeWidth="1.2" opacity="0.08" fill="none" />

          {/* Central star */}
          <circle cx="256" cy="256" r="38" fill="#7C3AED" filter="url(#logoGlow)" opacity="0.95" />
          <circle cx="256" cy="256" r="22" fill="#8B5CF6" opacity="0.6" />

          {/* Orbiting nodes */}
          <circle cx="152" cy="220" r="14" fill="#7C3AED" opacity="0.55" />
          <circle cx="370" cy="200" r="11" fill="#D97706" opacity="0.6" />
          <circle cx="340" cy="310" r="16" fill="#7C3AED" opacity="0.35" />
          <circle cx="90" cy="310" r="9" fill="#D97706" opacity="0.45" />
          <circle cx="410" cy="140" r="7" fill="#D97706" opacity="0.4" />

          {/* Connecting lines */}
          <line x1="236" y1="244" x2="160" y2="224" stroke="currentColor" strokeWidth="1" opacity="0.12" />
          <line x1="276" y1="244" x2="362" y2="206" stroke="currentColor" strokeWidth="1" opacity="0.12" />
          <line x1="272" y1="274" x2="332" y2="304" stroke="currentColor" strokeWidth="1" opacity="0.1" />
        </svg>
      )}
      <span className="text-[var(--text-body)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
        JAOstudio
      </span>
    </span>
  )
}

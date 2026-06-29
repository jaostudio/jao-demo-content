'use client'

import { useEffect, useRef, useState } from 'react'

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

type LikhaLogoProps = {
  variant?: 'mark' | 'wordmark' | 'lockup'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

const sizeMap = {
  mark: { sm: 20, md: 28, lg: 36 },
  wordmark: { sm: 'text-sm', md: 'text-xl', lg: 'text-3xl' },
  lockup: { sm: 20, md: 28, lg: 36 },
}

function LikhaMark({ size, animated, className }: { size: number; animated?: boolean; className?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const [visible, setVisible] = useState(!animated)

  useEffect(() => {
    if (!animated) return
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [animated])

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      {/* Corner frame — L shape */}
      <path
        d="M5 5v14h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(visible && animated ? 'animate-draw-path' : '')}
        style={{
          strokeDasharray: 28,
          strokeDashoffset: visible ? 0 : 28,
          transition: animated ? 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
        }}
      />
      {/* Diagonal stroke — creative process */}
      <line
        x1="17.5"
        y1="6.5"
        x2="8.5"
        y2="15.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={cn(visible && animated ? 'animate-fade-in' : '')}
        style={{ opacity: visible ? 1 : 0, transition: animated ? 'opacity 0.4s ease-out 0.3s' : 'none' }}
      />
      {/* Signal dot */}
      <circle
        cx="19.5"
        cy="19.5"
        r="1.5"
        className={cn('fill-current', visible && animated ? 'animate-pulse-dot' : '')}
        style={{ opacity: visible ? 1 : 0, transition: animated ? 'opacity 0.3s ease-out 0.6s' : 'none' }}
      />
    </svg>
  )
}

function LikhaWordmark({ size, className }: { size: 'sm' | 'md' | 'lg'; className?: string }) {
  return (
    <span
      className={cn(
        'font-bold tracking-[-0.04em] text-text-primary',
        sizeMap.wordmark[size],
        className,
      )}
    >
      LIKHA
    </span>
  )
}

export function LikhaLogo({ variant = 'mark', size = 'md', animated, className }: LikhaLogoProps) {
  if (variant === 'mark') {
    return (
      <LikhaMark
        size={sizeMap.mark[size]}
        animated={animated}
        className={className}
      />
    )
  }

  if (variant === 'wordmark') {
    return (
      <LikhaWordmark size={size} className={className} />
    )
  }

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LikhaMark size={sizeMap.lockup[size]} animated={animated} />
      <LikhaWordmark size={size} />
    </span>
  )
}

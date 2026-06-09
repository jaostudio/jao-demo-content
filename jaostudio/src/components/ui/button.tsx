'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { trackCTA } from '@/lib/analytics'
import { easeOut } from '@/lib/motion-variants'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  loading?: boolean
  trackingLabel?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', href, loading, trackingLabel, children, ...props }, ref) => {
    const baseStyles = cn(
      'relative inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-300',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
      'disabled:pointer-events-none disabled:opacity-40',
      {
        'bg-accent text-white hover:bg-accent-hover active:scale-[0.97]': variant === 'primary',
        'border border-border bg-surface-hover text-text-primary hover:bg-bg-elevated active:scale-[0.97]': variant === 'secondary',
        'text-text-secondary hover:text-text-primary active:scale-[0.97]': variant === 'ghost',
        'h-10 px-4 text-sm': size === 'sm',
        'h-12 px-6 text-base': size === 'md',
        'h-14 px-8 text-lg': size === 'lg',
      },
      className,
    )

    const content = (
      <>
        {loading && (
          <motion.span
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-border-hover border-t-accent" />
          </motion.span>
        )}
        <span className={cn(loading && 'invisible')}>{children}</span>
      </>
    )

    if (href) {
      const isExternal = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')
      return (
        <motion.a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className={baseStyles}
          whileHover={{ scale: 1.02, transition: { duration: 0.3, ease: easeOut } }}
          whileTap={{ scale: 0.97, transition: { duration: 0.3, ease: easeOut } }}
          onClick={() => { if (trackingLabel) trackCTA(trackingLabel, typeof window !== 'undefined' ? window.location.pathname : '') }}
        >
          {content}
        </motion.a>
      )
    }

    return (
      <motion.button
        ref={ref}
        className={baseStyles}
        whileHover={{ scale: 1.02, transition: { duration: 0.3, ease: easeOut } }}
        whileTap={{ scale: 0.97, transition: { duration: 0.3, ease: easeOut } }}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          if (trackingLabel) trackCTA(trackingLabel, window.location.pathname)
          props.onClick?.(e)
        }}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {content}
      </motion.button>
    )
  },
)

Button.displayName = 'Button'

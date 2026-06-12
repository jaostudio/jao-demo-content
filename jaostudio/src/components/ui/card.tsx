'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { easeOut } from '@/lib/motion-variants'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  onClick?: () => void
}

export function Card({ children, className, hover = true, glow, onClick }: CardProps) {
  return (
    <motion.div
      className={cn(
        'relative rounded-2xl border border-border-subtle bg-bg-surface p-6 md:p-8 focus:outline-none',
        hover && 'transition-colors duration-300 hover:bg-surface-hover hover:border-accent/30',
        'focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        glow && 'shadow-card',
        className,
      )}
      whileHover={hover ? { y: -2, transition: { duration: 0.3, ease: easeOut } } : undefined}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
    >
      {children}
    </motion.div>
  )
}

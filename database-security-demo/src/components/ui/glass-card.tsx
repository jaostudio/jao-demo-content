import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  as?: 'div' | 'section' | 'article'
}

export function GlassCard({ children, className, hover = true, as: Tag = 'div' }: GlassCardProps) {
  return (
    <Tag className={cn(hover ? 'glass-card' : 'glass-card-static', 'p-5', className)}>
      {children}
    </Tag>
  )
}

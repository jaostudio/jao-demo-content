import { cn } from '@/lib/cn'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'section' | 'header' | 'footer'
}

export function Container({ children, className, as: Tag = 'div' }: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full max-w-7xl px-6 md:px-8 lg:px-12', className)}>
      {children}
    </Tag>
  )
}

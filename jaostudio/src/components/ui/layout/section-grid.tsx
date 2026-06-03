import { cn } from '@/lib/cn'

type Gap = 'sm' | 'md' | 'lg' | 'xl'
type Align = 'start' | 'center' | 'end' | 'stretch'

const gaps: Record<Gap, string> = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
}

const spans: Record<number, string> = {
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
}

interface SectionGridProps {
  children: React.ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4 | 'auto'
  gap?: Gap
  align?: Align
  as?: 'div' | 'section'
}

export function SectionGrid({
  children,
  className,
  cols = 1,
  gap = 'lg',
  align = 'stretch',
  as: Tag = 'div',
}: SectionGridProps) {
  return (
    <Tag
      className={cn(
        'grid',
        cols === 'auto' && 'grid-cols-[repeat(auto-fit,minmax(280px,1fr))]',
        cols === 1 && 'grid-cols-1',
        cols === 2 && 'grid-cols-1 md:grid-cols-2',
        cols === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        cols === 4 && 'grid-cols-2 md:grid-cols-4',
        gaps[gap],
        align === 'start' && 'items-start',
        align === 'center' && 'items-center',
        align === 'end' && 'items-end',
        align === 'stretch' && 'items-stretch',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

interface ColumnProps {
  children: React.ReactNode
  className?: string
  span?: 1 | 2 | 3 | 'full'
}

export function Column({ children, className, span = 1 }: ColumnProps) {
  return (
    <div
      className={cn(
        span === 'full' && 'col-span-full',
        typeof span === 'number' && span > 1 && spans[span],
        className,
      )}
    >
      {children}
    </div>
  )
}

import { cn } from '@/lib/cn'

interface HeadingProps {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4'
}

export function Heading({ children, className, as: Tag = 'h2' }: HeadingProps) {
  const styles = cn(
    'font-semibold tracking-tight text-[#FAFAFA]',
    {
      'text-5xl md:text-6xl xl:text-7xl leading-[0.9]': Tag === 'h1',
      'text-4xl md:text-5xl leading-[1.1]': Tag === 'h2',
      'text-2xl md:text-3xl leading-[1.15]': Tag === 'h3',
      'text-xl md:text-2xl leading-[1.2]': Tag === 'h4',
    },
    className,
  )

  return <Tag className={styles}>{children}</Tag>
}

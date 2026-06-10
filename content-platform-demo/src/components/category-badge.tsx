import Link from 'next/link'

const categoryStyles: Record<string, string> = {
  technology: 'text-cat-tech border-cat-tech',
  design: 'text-cat-design border-cat-design',
  business: 'text-cat-business border-cat-business',
  default: 'text-neutral-600 border-neutral-400',
}

const dotStyles: Record<string, string> = {
  technology: 'bg-cat-tech',
  design: 'bg-cat-design',
  business: 'bg-cat-business',
  default: 'bg-neutral-400',
}

interface CategoryBadgeProps {
  slug: string
  name: string
}

export function CategoryBadge({ slug, name }: CategoryBadgeProps) {
  return (
    <Link
      href={`/category/${slug}`}
      className={`inline-flex items-center gap-1.5 border-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors hover:opacity-80 ${categoryStyles[slug] ?? categoryStyles.default}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[slug] ?? dotStyles.default}`} />
      {name}
    </Link>
  )
}

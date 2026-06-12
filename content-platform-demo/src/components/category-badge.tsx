import Link from 'next/link'

interface CategoryBadgeProps {
  slug: string
  name: string
}

export function CategoryBadge({ slug, name }: CategoryBadgeProps) {
  return (
    <Link
      href={`/category/${slug}`}
      className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-text-secondary transition-colors hover:bg-primary-light hover:text-primary dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-primary/20 dark:hover:text-primary"
    >
      {name}
    </Link>
  )
}

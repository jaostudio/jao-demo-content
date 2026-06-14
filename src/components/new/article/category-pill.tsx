import Link from 'next/link'
import { Badge } from '../ui/badge'

interface CategoryPillProps {
  slug: string
  name: string
}

export function CategoryPill({ slug, name }: CategoryPillProps) {
  return (
    <Link href={`/category/${slug}`}>
      <Badge variant="default">{name}</Badge>
    </Link>
  )
}

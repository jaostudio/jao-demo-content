import Link from 'next/link'
import { buildAuditNextHref } from '@/lib/pagination/audit-pagination'

export function AuditPageNav({ nextCursor, limit }: { nextCursor?: string | null; limit: number }) {
  if (!nextCursor) return null

  return (
    <div className="flex justify-center pt-2">
      <Link
        href={buildAuditNextHref(nextCursor, limit)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-isla-amethyst/10 px-4 py-2 text-xs font-medium text-isla-amethyst hover:bg-isla-amethyst/20 transition-colors"
      >
        Load More
      </Link>
    </div>
  )
}

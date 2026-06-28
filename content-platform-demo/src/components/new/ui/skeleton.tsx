interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-hairline dark:bg-surface-alt ${className}`}
      aria-hidden="true"
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-hairline bg-surface">
      <div className="flex items-center gap-2.5 px-4 py-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-2 px-4 py-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="flex items-center gap-3 px-4 pb-3">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-4" />
        <div className="ml-auto">
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-surface-hover ${className ?? ''}`} />
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-bg-surface p-6">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <div className="mt-2 flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  )
}

export function SkeletonSection() {
  return (
    <div className="flex flex-col gap-6 py-12">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}

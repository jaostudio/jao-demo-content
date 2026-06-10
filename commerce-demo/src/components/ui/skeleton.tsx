export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse-soft rounded-lg bg-surface/50 dark:bg-surface ${className ?? ''}`}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-subtle bg-white p-4 dark:border-subtle dark:bg-surface">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <div className="mt-3 flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-subtle dark:border-subtle">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="py-3">
          <Skeleton className="h-4 w-3/4" />
        </td>
      ))}
    </tr>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-12 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-16 w-full" />
          <div className="flex items-baseline gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function ReceiptSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="space-y-4 text-center">
        <Skeleton className="mx-auto h-16 w-16 rounded-full" />
        <Skeleton className="mx-auto h-8 w-1/2" />
        <Skeleton className="mx-auto h-4 w-2/3" />
      </div>
      <div className="mt-8 space-y-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid gap-6 sm:grid-cols-2">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    </div>
  )
}
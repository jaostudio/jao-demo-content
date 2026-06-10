import { ProductCardSkeleton } from '@/components/ui/skeleton'

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-baseline justify-between">
        <div className="h-8 w-48 animate-pulse-soft rounded bg-subtle dark:bg-surface" />
        <div className="h-4 w-16 animate-pulse-soft rounded bg-subtle dark:bg-surface" />
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-8 w-20 animate-pulse-soft rounded-full bg-subtle dark:bg-surface" />
        ))}
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
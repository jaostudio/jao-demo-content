import { Skeleton } from '@/components/new/ui/skeleton'

export default function SearchLoading() {
  return (
    <div className="max-w-[640px] mx-auto px-5 py-5">
      <div className="mb-6">
        <Skeleton className="h-5 w-24 mb-3" />
        <Skeleton className="h-11 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  )
}

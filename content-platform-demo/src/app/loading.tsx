import { Skeleton, SkeletonCard } from '@/components/new/ui/skeleton'
import { LeftRail } from '@/components/new/layout/left-rail'
import { Header } from '@/components/new/layout/header'
import { NEW_LAYOUT_ENABLED } from '@/lib/new/flags'

function NewLayoutLoading() {
  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      <LeftRail />
      <div className="lg:ml-[68px]">
        <Header />
        <main className="mx-auto max-w-[1080px] px-5 py-5">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-3">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-10" />
              </div>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <div className="hidden lg:block">
              <Skeleton className="h-80 w-full rounded-lg" />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function OldLayoutLoading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-4">
      <div className="space-y-3">
        <div className="mb-4 h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-3 rounded-lg border border-border bg-card p-3 dark:border-border-dark dark:bg-card-dark">
            <div className="h-16 w-16 shrink-0 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-700" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default function Loading() {
  if (NEW_LAYOUT_ENABLED) return <NewLayoutLoading />
  return <OldLayoutLoading />
}

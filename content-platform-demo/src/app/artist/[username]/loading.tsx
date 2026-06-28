import { Skeleton, SkeletonCard } from '@/components/new/ui/skeleton'
import { LeftRail } from '@/components/new/layout/left-rail'
import { Header } from '@/components/new/layout/header'

export default function ArtistLoading() {
  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      <LeftRail />
      <div className="lg:ml-[68px]">
        <Header />
        <main className="mx-auto max-w-[1080px] px-5 py-5">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <div className="flex items-start gap-5">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-56" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              </div>
              <div className="space-y-4">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            </div>
            <div className="hidden lg:block">
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

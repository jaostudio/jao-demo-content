import { Skeleton, SkeletonCard } from '@/components/new/ui/skeleton'
import { LeftRail } from '@/components/new/layout/left-rail'
import { Header } from '@/components/new/layout/header'

export default function ExploreLoading() {
  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      <LeftRail />
      <div className="lg:ml-[68px]">
        <Header />
        <main className="mx-auto max-w-[1080px] px-5 py-5">
          <div className="mb-6">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-3 w-56 mt-2" />
          </div>

          <section className="mb-8">
            <Skeleton className="h-4 w-28 mb-3" />
            <div className="grid gap-4 md:grid-cols-3">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </section>

          <section className="mb-8">
            <Skeleton className="h-4 w-28 mb-3" />
            <div className="space-y-3">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

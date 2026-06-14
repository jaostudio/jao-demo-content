import { NEW_LAYOUT_ENABLED } from '@/lib/new/flags'
import { Header as OldHeader } from '@/components/header'
import { Header as NewHeader } from '@/components/new/layout/header'
import { LeftRail } from '@/components/new/layout/left-rail'
import { Sidebar } from './sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (NEW_LAYOUT_ENABLED) {
    return (
      <div className="min-h-screen bg-surface dark:bg-surface-dark">
        <LeftRail />
        <div className="lg:ml-[56px]">
          <NewHeader />
          <div className="mx-auto flex max-w-5xl gap-6 px-4 py-4">
            <Sidebar />
            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <OldHeader />
      <div className="mx-auto flex max-w-5xl gap-6 px-4 py-4">
        <Sidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </>
  )
}

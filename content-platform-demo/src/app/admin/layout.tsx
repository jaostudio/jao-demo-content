import { NEW_LAYOUT_ENABLED } from '@/lib/new/flags'
import { Header as OldHeader } from '@/components/header'
import { Header as NewHeader } from '@/components/new/layout/header'
import { Sidebar } from './sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {NEW_LAYOUT_ENABLED ? <NewHeader /> : <OldHeader />}
      <div className="mx-auto flex max-w-5xl gap-6 px-4 py-4">
        <Sidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </>
  )
}

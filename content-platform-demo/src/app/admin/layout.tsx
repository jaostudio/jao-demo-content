import { Header } from '@/components/header'
import { Sidebar } from './sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8">
        <Sidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </>
  )
}

import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/get-session'
import { Sidebar } from '@/components/sidebar'
import { Topbar } from '@/components/topbar'
import { PageTransition } from '@/components/page-transition'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/signin')

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-auto">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  )
}

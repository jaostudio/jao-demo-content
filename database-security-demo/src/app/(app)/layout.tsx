import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/get-session'
import { Sidebar } from '@/components/sidebar'
import { Topbar } from '@/components/topbar'
import { PageTransition } from '@/components/page-transition'
import { SecurityProofProvider } from '@/components/security-proof-panel'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/signin')

  return (
    <SecurityProofProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar sandboxMode={process.env.SANDBOX_MODE === 'true'} />
          <main className="flex-1 overflow-auto">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
    </SecurityProofProvider>
  )
}

import { getCurrentUser } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/signin')
  if (!user.orgId) redirect('/dashboard')

  const settings = await (prisma as any).securitySetting.findMany({
    where: { organizationId: user.orgId },
  })

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold">Security Settings</h1>
        <p className="mb-8 text-sm text-gray-500">Organization-level security configuration.</p>

        <div className="space-y-3">
          {settings.map((s: any) => (
            <div key={s.id} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">{s.key.replace(/_/g, ' ')}</p>
                <p className="text-xs text-gray-500">Updated {new Date(s.updatedAt).toLocaleDateString()}</p>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">{s.value}</span>
            </div>
          ))}
          {settings.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-8">No security settings configured.</p>
          )}
        </div>
      </main>
    </>
  )
}

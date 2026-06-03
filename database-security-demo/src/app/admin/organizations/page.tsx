import { getCurrentUser } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { createOrganization, deleteOrganization } from '@/lib/actions'

export const dynamic = 'force-dynamic'

export default async function AdminOrganizationsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'SYSTEM_ADMIN') redirect('/dashboard')

  const orgs = await (prisma as any).organization.findMany({
    include: { _count: { select: { users: true, documents: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold">Organizations</h1>
        <p className="mb-8 text-sm text-gray-500">System administration — manage organizations.</p>

        <div className="mb-8 rounded-lg border p-6">
          <h2 className="mb-4 font-semibold">Create Organization</h2>
          <form action={createOrganization} className="flex gap-3">
            <input name="name" placeholder="Organization name" required className="flex-1 rounded-lg border px-3 py-2 text-sm" />
            <button type="submit" className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700">Create</button>
          </form>
        </div>

        <div className="space-y-3">
          {orgs.map((org: any) => (
            <div key={org.id} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">{org.name}</p>
                <p className="text-xs text-gray-500">{org.slug} · {org._count.users} users · {org._count.documents} documents</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{new Date(org.createdAt).toLocaleDateString()}</span>
                <form action={deleteOrganization.bind(null, org.id)}>
                  <button type="submit" className="text-xs text-red-600 hover:underline">Delete</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}

import { getCurrentUser } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { createOrgUser, deleteUser } from '@/lib/actions'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'SYSTEM_ADMIN') redirect('/dashboard')

  const [users, orgs] = await Promise.all([
    (prisma as any).user.findMany({
      include: { organization: true, _count: { select: { documents: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    (prisma as any).organization.findMany({ orderBy: { name: 'asc' } }),
  ])

  const roleColors: Record<string, string> = {
    SYSTEM_ADMIN: 'bg-red-100 text-red-700',
    ORG_ADMIN: 'bg-blue-100 text-blue-700',
    ORG_USER: 'bg-green-100 text-green-700',
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold">Users</h1>
        <p className="mb-8 text-sm text-gray-500">System administration — manage users across organizations.</p>

        <div className="mb-8 rounded-lg border p-6">
          <h2 className="mb-4 font-semibold">Create User</h2>
          <form action={createOrgUser} className="flex flex-wrap gap-3">
            <input name="name" placeholder="Name" required className="flex-1 min-w-[150px] rounded-lg border px-3 py-2 text-sm" />
            <input name="email" type="email" placeholder="Email" required className="flex-1 min-w-[200px] rounded-lg border px-3 py-2 text-sm" />
            <select name="role" required className="rounded-lg border px-3 py-2 text-sm">
              <option value="ORG_USER">ORG_USER</option>
              <option value="ORG_ADMIN">ORG_ADMIN</option>
              <option value="SYSTEM_ADMIN">SYSTEM_ADMIN</option>
            </select>
            <select name="orgId" className="rounded-lg border px-3 py-2 text-sm">
              <option value="">No org</option>
              {orgs.map((o: any) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
            <button type="submit" className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700">Create</button>
          </form>
          <p className="mt-2 text-xs text-gray-400">Default password: password123</p>
        </div>

        <div className="space-y-2">
          {users.map((u: any) => (
            <div key={u.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColors[u.role] ?? 'bg-gray-100'}`}>{u.role}</span>
                <span className="text-xs text-gray-400">{u.organization?.name ?? '-'}</span>
                <span className="text-xs text-gray-400">{u._count.documents} docs</span>
                {u.role !== 'SYSTEM_ADMIN' && (
                  <form action={deleteUser.bind(null, u.id)}>
                    <button type="submit" className="text-xs text-red-600 hover:underline">Delete</button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}

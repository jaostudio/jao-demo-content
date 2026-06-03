import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!user || user.role !== 'ADMIN') redirect('/auth/signin')

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Users</h1>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left dark:border-neutral-800">
              <th className="pb-3 font-medium text-neutral-500">Name</th>
              <th className="pb-3 font-medium text-neutral-500">Email</th>
              <th className="pb-3 font-medium text-neutral-500">Role</th>
              <th className="pb-3 font-medium text-neutral-500">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-neutral-100 dark:border-neutral-900">
                <td className="py-3 font-medium">{u.name}</td>
                <td className="py-3 text-neutral-500">{u.email}</td>
                <td className="py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                    u.role === 'VENDOR' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                  }`}>{u.role}</span>
                </td>
                <td className="py-3 text-xs text-neutral-500">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

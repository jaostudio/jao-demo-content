import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DashboardOrdersPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!user || !(user.role === 'VENDOR' || user.role === 'ADMIN')) redirect('/auth/signin')

  const orders = await prisma.order.findMany({
    where: { vendorId: user.id },
    include: { items: true, buyer: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Orders Received</h1>
      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-sm">{order.orderNumber}</p>
                <p className="text-sm text-neutral-500">{order.buyer.name}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">${(order.total / 100).toFixed(2)}</p>
                <p className="text-xs text-neutral-500 capitalize">{order.paymentState.toLowerCase().replace(/_/g, ' ')}</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-neutral-500">
              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-center text-neutral-500 py-8">No orders yet.</p>}
      </div>
    </div>
  )
}

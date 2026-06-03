import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!user || !(user.role === 'VENDOR' || user.role === 'ADMIN')) redirect('/auth/signin')

  const listingsCount = await prisma.listing.count({ where: { vendorId: user.id } })
  const ordersCount = await prisma.order.count({ where: { vendorId: user.id } })
  const reviewsCount = await prisma.review.count({
    where: { listing: { vendorId: user.id } },
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
          <p className="text-sm text-neutral-500">Listings</p>
          <p className="mt-1 text-3xl font-bold">{listingsCount}</p>
          <Link href="/dashboard/listings" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
            Manage →
          </Link>
        </div>
        <div className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
          <p className="text-sm text-neutral-500">Orders</p>
          <p className="mt-1 text-3xl font-bold">{ordersCount}</p>
          <Link href="/dashboard/orders" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
            View →
          </Link>
        </div>
        <div className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
          <p className="text-sm text-neutral-500">Reviews</p>
          <p className="mt-1 text-3xl font-bold">{reviewsCount}</p>
        </div>
      </div>
    </div>
  )
}

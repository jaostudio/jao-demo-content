import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DashboardListingsPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!user || !(user.role === 'VENDOR' || user.role === 'ADMIN')) redirect('/auth/signin')

  const listings = await prisma.listing.findMany({
    where: { vendorId: user.id },
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">My Listings</h1>
      <div className="mt-8 space-y-4">
        {listings.map((l) => (
          <div key={l.id} className="flex items-center justify-between rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
            <div>
              <Link href={`/listings/${l.slug}`} className="font-semibold hover:underline">{l.title}</Link>
              <p className="text-sm text-neutral-500">{l.category.name} — ${(l.price / 100).toFixed(2)}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
              l.status === 'APPROVED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              l.status === 'PENDING_REVIEW' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
              l.status === 'REJECTED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
              'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
            }`}>
              {l.status.replace(/_/g, ' ')}
            </span>
          </div>
        ))}
        {listings.length === 0 && <p className="text-center text-neutral-500 py-8">No listings yet.</p>}
      </div>
    </div>
  )
}

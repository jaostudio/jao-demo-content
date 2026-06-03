import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function MarketplaceHome() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  const featured = await prisma.listing.findMany({
    where: { status: 'APPROVED' },
    include: { vendor: { select: { name: true } }, category: { select: { name: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Discover Unique Goods</h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Shop from independent vendors. Handmade, vintage, and artisan finds — curated for you.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/listings"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-neutral-900 px-8 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Browse All
          </Link>
          <Link
            href="/auth/register"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-neutral-200 bg-white px-8 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
          >
            Start Selling
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-bold">Categories</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/listings?category=${cat.slug}`}
              className="rounded-full bg-neutral-100 px-5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Featured Listings</h2>
          <Link href="/listings" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400">
            View all →
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((listing) => (
            <Link
              key={listing.id}
              href={`/listings/${listing.slug}`}
              className="group rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-950"
            >
              <div className="aspect-square rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 text-2xl font-bold">
                {listing.title.charAt(0)}
              </div>
              <div className="mt-4">
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  {listing.category.name}
                </span>
                <h3 className="mt-1 font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {listing.title}
                </h3>
                <p className="mt-1 text-xs text-neutral-500">by {listing.vendor.name}</p>
                <p className="mt-2 text-lg font-bold">${(listing.price / 100).toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

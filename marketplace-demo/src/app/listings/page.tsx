import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const { category, q } = await searchParams
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  const where: any = { status: 'APPROVED' }
  if (category) where.category = { slug: category }
  if (q) where.OR = [
    { title: { contains: q } },
    { description: { contains: q } },
  ]

  const listings = await prisma.listing.findMany({
    where,
    include: { vendor: { select: { name: true } }, category: { select: { name: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Listings</h1>

      <form method="GET" className="mt-6 flex gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search listings..."
          className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-950"
        />
        <button type="submit" className="rounded-xl bg-neutral-900 px-6 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900">
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/listings"
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !category ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400'
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/listings?category=${cat.slug}${q ? `&q=${q}` : ''}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              category === cat.slug ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
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
        {listings.length === 0 && (
          <p className="col-span-full text-center text-neutral-500 py-12">No listings found.</p>
        )}
      </div>
    </div>
  )
}

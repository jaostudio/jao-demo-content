import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AddToCartButton } from './add-to-cart-button'

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const listing = await prisma.listing.findUnique({
    where: { slug },
    include: {
      vendor: { select: { id: true, name: true } },
      category: { select: { name: true } },
      images: { orderBy: { sortOrder: 'asc' } },
      reviews: {
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })
  if (!listing || listing.status !== 'APPROVED') notFound()

  const avgRating = listing.reviews.length > 0
    ? (listing.reviews.reduce((s, r) => s + r.rating, 0) / listing.reviews.length).toFixed(1)
    : null

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-4">
          {listing.images.length > 0 ? (
            listing.images.map((img) => (
              <div key={img.id} className="aspect-square rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 text-4xl font-bold">
                {img.alt ?? listing.title.charAt(0)}
              </div>
            ))
          ) : (
            <div className="aspect-square rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 text-6xl font-bold">
              {listing.title.charAt(0)}
            </div>
          )}
        </div>

        <div>
          <span className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
            {listing.category.name}
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{listing.title}</h1>
          <p className="mt-1 text-sm text-neutral-500">by {listing.vendor.name}</p>

          {avgRating && (
            <p className="mt-2 text-sm">
              <span className="text-amber-500">{'★'.repeat(Math.round(Number(avgRating)))}</span>
              {'☆'.repeat(5 - Math.round(Number(avgRating)))}
              {' '}{avgRating} ({listing.reviews.length} reviews)
            </p>
          )}

          <p className="mt-6 text-4xl font-bold">${(listing.price / 100).toFixed(2)}</p>

          <p className="mt-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {listing.description}
          </p>

          <AddToCartButton listing={{
            id: listing.id,
            title: listing.title,
            price: listing.price,
            vendorId: listing.vendor.id,
            vendorName: listing.vendor.name,
          }} />

          <div className="mt-16">
            <h2 className="text-xl font-bold">Reviews</h2>
            {listing.reviews.length === 0 ? (
              <p className="mt-4 text-neutral-500">No reviews yet.</p>
            ) : (
              <div className="mt-6 space-y-6">
                {listing.reviews.map((review) => (
                  <div key={review.id} className="border-b border-neutral-200 pb-6 dark:border-neutral-800">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{review.author.name}</p>
                      <span className="text-sm text-amber-500">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

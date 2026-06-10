import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getLang } from '@/lib/lang'
import AddToCartButton from './add-to-cart-button'
import { SariRush } from './sari-rush'
import { productReviews } from '@/lib/reviews'
import { Star } from 'lucide-react'
import { getActiveFlashSale } from '@/lib/actions/flash-sales'
import { FlashSaleTimer } from '@/components/flash-sale-timer'
import { LikeButton } from '@/components/like-button'
import { ReviewForm } from '@/components/review-form'
import { QASection } from '@/components/qa-section'
import { auth } from '@/lib/auth'

async function getReviewsForProduct(productId: string) {
  return prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: 'desc' },
  })
}

async function getLikeData(productId: string, userId?: string) {
  const [count, userLike] = await Promise.all([
    prisma.userLike.count({ where: { productId } }),
    userId ? prisma.userLike.findUnique({ where: { userId_productId: { userId, productId } } }) : Promise.resolve(null),
  ])
  return { count, liked: !!userLike }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const lang = await getLang()
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  })
  if (!product) notFound()

  const session = await auth()
  const userId = (session?.user as { id?: string })?.id

  const flashSale = await getActiveFlashSale(product.id)
  const discountedPrice = flashSale ? Math.round(product.price * (1 - flashSale.discountPercent / 100)) : null

  const [dbReviews, likeData] = await Promise.all([
    getReviewsForProduct(product.id),
    getLikeData(product.id, userId),
  ])

  const reviews = dbReviews.length > 0 ? dbReviews : (productReviews[slug] ?? [])

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, slug: { not: product.slug } },
    take: 3,
    orderBy: { createdAt: 'desc' },
  })
  const avgRating = reviews.length
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden rounded-xl border border-subtle">
          <img
            src={product.image}
            alt={lang === 'tl' ? product.nameTl : product.nameEn}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info */}
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-muted">
            {lang === 'tl' ? product.category.nameTl : product.category.nameEn}
          </span>
          <h1 className="mt-2 font-[var(--font-display)] text-3xl font-bold tracking-tight">
            {lang === 'tl' ? product.nameTl : product.nameEn}
          </h1>
          <p className="mt-1 text-sm text-muted">{lang === 'tl' ? product.nameEn : product.nameTl}</p>
          <p className="mt-4 text-muted">{lang === 'tl' ? product.descriptionTl : product.descriptionEn}</p>
          <p className="mt-2 text-sm text-muted">{lang === 'tl' ? product.descriptionEn : product.descriptionTl}</p>

          <div className="mt-6 flex items-baseline gap-4">
            {flashSale && discountedPrice ? (
              <>
                <p className="text-4xl font-bold text-flag-red">₱{(discountedPrice / 100).toFixed(2)}</p>
                <p className="text-lg text-muted line-through">₱{(product.price / 100).toFixed(2)}</p>
                <span className="rounded-lg bg-flag-red px-2 py-0.5 text-xs font-bold text-white">-{flashSale.discountPercent}%</span>
                <FlashSaleTimer endTime={flashSale.endTime.toISOString()} />
              </>
            ) : (
              <>
                <p className="text-4xl font-bold">₱{(product.price / 100).toFixed(2)}</p>
                <SariRush />
              </>
            )}
            <span className={`text-sm font-medium ${product.inventory > 0 ? 'text-leafy-green' : 'text-flag-red'}`}>
              {product.inventory > 0
                ? `${product.inventory} ${lang === 'tl' ? 'sa stock' : 'in stock'}`
                : lang === 'tl' ? 'Ubos na, mamsir!' : 'Out of stock, mamsir!'}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="rounded-lg border border-leafy-green/30 bg-leafy-green/5 px-4 py-2 text-xs text-leafy-green-dark dark:text-leafy-green">
              <span className="font-semibold">{lang === 'tl' ? 'Tindera:' : 'Vendor:'}</span> {product.vendorName}
            </div>
            <LikeButton productId={product.id} initialLiked={likeData.liked} initialCount={likeData.count} />
          </div>

          {product.inventory > 0 ? (
            <>
              <AddToCartButton
                product={{
                  slug: product.slug,
                  nameTl: product.nameTl,
                  nameEn: product.nameEn,
                  price: product.price,
                  image: product.image,
                  inventory: product.inventory,
                }}
              />
            </>
          ) : (
            <div className="mt-6 rounded-xl bg-flag-red/10 px-4 py-3 text-center text-sm font-medium text-flag-red">
              {lang === 'tl' ? 'Ubos na, mamsir! — Balik ka na lang o humanap ng iba.' : 'Out of stock, mamsir! — Check back later or try another product.'}
            </div>
          )}

          {/* Details */}
          <dl className="mt-8 space-y-4 border-t border-subtle pt-8">
            <div className="flex justify-between">
              <dt className="text-sm text-muted">{lang === 'tl' ? 'Kategorya' : 'Category'}</dt>
              <dd className="text-sm">{product.category.nameTl} ({product.category.nameEn})</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted">{lang === 'tl' ? 'Tindera' : 'Vendor'}</dt>
              <dd className="text-sm">{product.vendorName}</dd>
            </div>
          </dl>

          {/* Reviews */}
          <div className="mt-8 border-t border-subtle pt-8">
            <div className="flex items-center justify-between">
              <h2 className="font-[var(--font-display)] text-xl font-bold">{lang === 'tl' ? 'Chismis &amp; Pictures' : 'Reviews &amp; Pictures'}</h2>
              {avgRating && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(Number(avgRating)) ? 'fill-flag-yellow text-flag-yellow' : 'text-muted'}`}
                    />
                  ))}
                  <span className="ml-1 text-sm text-muted">{avgRating}</span>
                </div>
              )}
            </div>
            <ReviewForm productId={product.id} />
            <div className="mt-4 space-y-4">
              {reviews.length > 0 ? (
                reviews.slice(0, 5).map((review: any, idx: number) => (
                  <div key={review.id ?? idx} className="rounded-lg border border-subtle p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < review.rating ? 'fill-flag-yellow text-flag-yellow' : 'text-muted'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium">{review.author}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted">&ldquo;{review.comment}&rdquo;</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted">{lang === 'tl' ? 'Wala pang chismis — ikaw na mag-umpisa!' : 'No reviews yet — be the first!'}</p>
              )}
            </div>
          </div>

          {/* Q&A */}
          <QASection productId={product.id} />

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-8 border-t border-subtle pt-8">
              <h2 className="font-[var(--font-display)] text-xl font-bold">{lang === 'tl' ? 'Bili na rin ng&hellip;' : 'You might also like&hellip;'}</h2>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {related.map((r) => (
                  <a
                    key={r.id}
                    href={`/products/${r.slug}`}
                    className="group overflow-hidden rounded-xl border border-subtle p-3 transition-all hover:border-flag-blue/30 hover:shadow-md dark:bg-surface"
                  >
                    <div className="aspect-square overflow-hidden rounded-lg bg-surface dark:bg-surface">
                      <img src={r.image} alt={lang === 'tl' ? r.nameTl : r.nameEn} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                    </div>
                    <p className="mt-2 truncate text-xs font-medium">{lang === 'tl' ? r.nameTl : r.nameEn}</p>
                    <p className="text-sm font-bold">₱{(r.price / 100).toFixed(2)}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

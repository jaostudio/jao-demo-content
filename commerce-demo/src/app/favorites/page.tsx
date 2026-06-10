import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function FavoritesPage() {
  const session = await auth()
  if (!session?.user) redirect('/signin')

  const likes = await prisma.userLike.findMany({
    where: { userId: session.user.id },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const products = likes.map((l) => l.product)

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-[var(--font-display)] text-3xl font-bold">My Favorites</h1>
      {products.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-lg text-muted">Wala ka pang favorite</p>
          <Link href="/products" className="mt-4 inline-block rounded-lg bg-flag-blue px-6 py-2 text-sm font-semibold text-white">
            Mamili ka na!
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group overflow-hidden rounded-xl border border-subtle bg-surface p-4 transition-all hover:border-subtle hover:shadow-md dark:bg-surface"
            >
              <div className="aspect-square overflow-hidden rounded-lg bg-surface dark:bg-surface">
                <img
                  src={product.image}
                  alt={product.nameTl}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="mt-4">
                <span className="text-xs font-medium uppercase tracking-wider text-muted">
                  {product.category.nameTl}
                </span>
                <h3 className="mt-1 font-semibold">
                  {product.nameTl}
                </h3>
                <p className="mt-1 text-sm text-muted line-clamp-2">{product.descriptionTl}</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-lg font-bold">₱{(product.price / 100).toFixed(2)}</p>
                  <span className={`text-xs font-medium ${product.inventory > 0 ? 'text-leafy-green' : 'text-flag-red'}`}>
                    {product.inventory > 0 ? `${product.inventory} stock` : 'Ubos na'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

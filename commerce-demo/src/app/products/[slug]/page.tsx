import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/products'
import AddToCartButton from './add-to-cart-button'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="aspect-square rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 text-6xl font-bold">
          {product.name.charAt(0)}
        </div>

        <div>
          <span className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
            {product.category.name}
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{product.name}</h1>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            {product.description}
          </p>
          <p className="mt-6 text-4xl font-bold">${(product.price / 100).toFixed(2)}</p>
          <p className="mt-2 text-sm text-neutral-500">
            {product.inventory > 0 ? `${product.inventory} in stock` : 'Out of stock'}
          </p>

          <AddToCartButton product={product} />

          <dl className="mt-8 space-y-4 border-t border-neutral-200 pt-8 dark:border-neutral-800">
            <div className="flex justify-between">
              <dt className="text-sm text-neutral-500">SKU</dt>
              <dd className="text-sm font-mono">{product.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-neutral-500">Category</dt>
              <dd className="text-sm">{product.category.name}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

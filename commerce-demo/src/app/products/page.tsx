import Link from 'next/link'
import { getCategories } from '@/lib/products'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const { getProducts } = await import('@/lib/products')
  const categories = await getCategories()
  const products = category
    ? await (await import('@/lib/products')).getProductsByCategory(category)
    : await getProducts()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Products</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !category
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400'
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              category === cat.slug
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/products/${product.slug}`}
            className="group rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-950"
          >
            <div className="aspect-square rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 text-sm">
              {product.name.charAt(0)}
            </div>
            <div className="mt-4">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                {product.category.name}
              </span>
              <h3 className="mt-1 font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {product.name}
              </h3>
              <p className="mt-1 text-sm text-neutral-500 line-clamp-2">{product.description}</p>
              <p className="mt-2 text-lg font-bold">${(product.price / 100).toFixed(2)}</p>
            </div>
          </Link>
        ))}
        {products.length === 0 && (
          <p className="col-span-full text-center text-neutral-500 py-12">No products found.</p>
        )}
      </div>
    </div>
  )
}

import { getProductsWithStock } from '@/lib/actions/orders'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await getProductsWithStock()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-[var(--font-display)] text-2xl font-bold">Manage Tinda / Products</h1>
        <Link
          href="/admin/orders"
          className="rounded-lg border border-subtle px-4 py-2 text-sm font-medium transition-colors hover:border-subtle hover:text-foreground"
        >
          Orders
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-subtle text-left">
              <th className="pb-3 font-medium text-muted">Product</th>
              <th className="pb-3 font-medium text-muted">Category</th>
              <th className="pb-3 font-medium text-muted">Price</th>
              <th className="pb-3 font-medium text-muted">Stock</th>
              <th className="pb-3 font-medium text-muted">Vendor</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-subtle dark:border-stone-800">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 overflow-hidden rounded-lg border border-subtle">
                      <img src={product.image} alt={product.nameTl} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="font-medium">{product.nameTl}</p>
                      <p className="text-xs text-muted">{product.nameEn}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-xs text-muted">{product.category.nameTl}</td>
                <td className="py-3 font-semibold">₱{(product.price / 100).toFixed(2)}</td>
                <td className="py-3">
                  <span className={`font-medium ${product.inventory > 10 ? 'text-leafy-green' : product.inventory > 0 ? 'text-flag-red' : 'text-flag-red'}`}>
                    {product.inventory}
                  </span>
                </td>
                <td className="py-3 text-xs text-muted">{product.vendorName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

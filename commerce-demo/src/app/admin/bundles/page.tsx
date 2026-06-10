import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminBundlesPage() {
  const bundles = await prisma.bundle.findMany({ orderBy: { name: 'asc' } })
  const products = await prisma.product.findMany({ orderBy: { nameTl: 'asc' } })

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-[var(--font-display)] text-3xl font-bold">Bundle Deals</h1>
      <p className="mt-2 text-sm text-muted">Create buy-more-save-more deals</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-subtle p-6">
          <h2 className="font-[var(--font-display)] text-lg font-bold">New Bundle</h2>
          <form action="/api/admin/bundles" method="POST" className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium">Bundle Name</label>
              <input name="name" required className="mt-1 block w-full rounded-xl border border-subtle bg-white px-4 py-2.5 text-sm dark:bg-surface" />
            </div>
            <div>
              <label className="block text-sm font-medium">Products (select multiple)</label>
              <select name="productIds" multiple required size={6} className="mt-1 block w-full rounded-xl border border-subtle bg-white px-4 py-2.5 text-sm dark:bg-surface">
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.nameTl} (₱{(p.price / 100).toFixed(2)})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Discount (in centavos, e.g. 2000 = ₱20)</label>
              <input name="discountTotal" type="number" required className="mt-1 block w-full rounded-xl border border-subtle bg-white px-4 py-2.5 text-sm dark:bg-surface" />
            </div>
            <button type="submit" className="rounded-xl bg-flag-blue px-6 py-2 text-sm font-semibold text-white hover:brightness-90">
              Create Bundle
            </button>
          </form>
        </div>

        <div>
          <h2 className="font-[var(--font-display)] text-lg font-bold">Existing Bundles</h2>
          <div className="mt-4 space-y-3">
            {bundles.length === 0 && <p className="text-sm text-muted">No bundles yet.</p>}
            {bundles.map((b) => (
              <div key={b.id} className="rounded-lg border border-subtle p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{b.name}</p>
                  <span className="text-xs text-flag-yellow">-₱{(b.discountTotal / 100).toFixed(2)}</span>
                </div>
                <p className="mt-1 text-xs text-muted">Products: {b.productIds}</p>
                <p className="text-xs text-muted">{b.active ? 'Active' : 'Inactive'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

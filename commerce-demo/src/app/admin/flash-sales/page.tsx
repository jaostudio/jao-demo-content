import { prisma } from '@/lib/prisma'
import { FlashSaleForm } from './flash-sale-form'

export const dynamic = 'force-dynamic'

export default async function AdminFlashSalesPage() {
  const flashSales = await prisma.flashSale.findMany({
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  })
  const products = await prisma.product.findMany({ orderBy: { nameEn: 'asc' } })

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-[var(--font-display)] text-3xl font-bold">Flash Sales</h1>
      <p className="mt-2 text-sm text-muted">Create and manage time-bound discounts</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-subtle p-6">
          <h2 className="font-[var(--font-display)] text-lg font-bold">New Flash Sale</h2>
          <FlashSaleForm products={products} />
        </div>

        <div>
          <h2 className="font-[var(--font-display)] text-lg font-bold">Active Sales</h2>
          <div className="mt-4 space-y-3">
            {flashSales.length === 0 && <p className="text-sm text-muted">No flash sales yet.</p>}
            {flashSales.map((fs) => (
              <div key={fs.id} className="rounded-lg border border-subtle p-4">
                <p className="text-sm font-medium">{fs.product.nameTl}</p>
                <p className="text-xs text-muted">{fs.discountPercent}% off</p>
                <p className="text-xs text-muted">
                  {new Date(fs.startTime).toLocaleDateString()} - {new Date(fs.endTime).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, vendor: { select: { name: true } } },
  })
  if (!order) notFound()

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-bold">Order Confirmed!</h1>
        <p className="mt-2 text-neutral-500">Order #{order.orderNumber}</p>
      </div>

      <div className="mt-12 rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
        <h2 className="text-lg font-semibold">Details</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-neutral-500">Vendor</dt>
            <dd>{order.vendor.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">Payment</dt>
            <dd className="capitalize">{order.paymentState.toLowerCase().replace(/_/g, ' ')}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">Fulfillment</dt>
            <dd className="capitalize">{order.fulfillmentState.toLowerCase().replace(/_/g, ' ')}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
        <h2 className="text-lg font-semibold">Items</h2>
        <div className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold">${((item.priceAtPurchase * item.quantity) / 100).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4 text-lg font-bold dark:border-neutral-800">
          <span>Total</span>
          <span>${(order.total / 100).toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/listings" className="text-sm font-medium text-neutral-600 hover:underline dark:text-neutral-400">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

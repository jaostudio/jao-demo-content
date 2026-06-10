import { notFound } from 'next/navigation'
import { getOrder } from '@/lib/actions/orders'
import Link from 'next/link'
import { ReturnRequestForm } from '@/components/return-request-form'
import { Truck } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getOrder(id)
  if (!order) notFound()

  const stageLabels: Record<string, string> = {
    unfulfilled: 'Naka-plastic na',
    processing: 'Nasa tricycle',
    shipped: 'Nasa courier na',
    delivered: 'Nasa pintuan mo',
  }

  const stages = [
    { key: 'unfulfilled', label: 'Naka-plastic na', done: true },
    { key: 'processing', label: 'Nasa tricycle', done: order.fulfillmentState !== 'unfulfilled' },
    { key: 'shipped', label: 'Nasa courier na', done: ['shipped', 'delivered'].includes(order.fulfillmentState) },
    { key: 'delivered', label: 'Nasa pintuan mo', done: order.fulfillmentState === 'delivered' },
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="text-center">
        <span className="text-5xl">📦</span>
        <h1 className="mt-4 font-[var(--font-display)] text-2xl font-bold">Order Received, Salamat!</h1>
        <p className="mt-2 text-muted">
          Your order <strong className="font-mono text-flag-blue">{order.orderNumber}</strong> is nakapila na kay Kuya Rider.
        </p>
      </div>

      {/* Tracking */}
      <div className="mt-8 rounded-xl border border-subtle p-6">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Saan na ang order?</h2>
        <div className="mt-4 space-y-4">
          {stages.map((stage, i) => (
            <div key={stage.key} className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                stage.done ? 'bg-leafy-green text-white' : 'bg-surface text-muted dark:bg-surface'
              }`}>
                {stage.done ? '✓' : i + 1}
              </div>
              <div>
                <p className={`text-sm font-medium ${stage.done ? 'text-muted' : 'text-muted'}`}>
                  {stage.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-subtle p-6">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Customer</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Name</dt>
              <dd>{order.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Email</dt>
              <dd>{order.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Address</dt>
              <dd className="text-right text-xs">{order.barangay}, {order.city}, {order.province}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Payment</dt>
              <dd className="font-medium uppercase">{order.paymentMethod}</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-xl border border-subtle p-6">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Status</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Payment</dt>
              <dd className={`font-medium ${order.paymentState === 'paid' ? 'text-leafy-green' : 'text-flag-yellow'}`}>
                {order.paymentState === 'paid' ? 'Paid ✓' : 'Pending payment'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Fulfillment</dt>
              <dd className="font-medium">{stageLabels[order.fulfillmentState] ?? order.fulfillmentState}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Total</dt>
              <dd className="font-bold">₱{(order.total / 100).toFixed(2)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Rider Info */}
      {order.riderName && (
        <div className="mt-6 rounded-xl border border-flag-blue/20 bg-flag-blue/5 p-4 dark:border-flag-blue/30">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-flag-blue" />
            <span className="text-sm font-semibold text-flag-blue">Rider Info</span>
          </div>
          <p className="mt-1 text-sm text-muted">
            <strong>{order.riderName}</strong> {order.eta ? `— ETA: ${order.eta}` : ''}
          </p>
        </div>
      )}

      {/* Return Request */}
      {order.fulfillmentState === 'delivered' && (
        <div className="mt-6">
          <ReturnRequestForm orderId={order.id} orderNumber={order.orderNumber} />
        </div>
      )}

      {/* Items */}
      <div className="mt-6 rounded-xl border border-subtle p-6">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Items</h2>
        <div className="mt-4 divide-y divide-subtle">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-subtle">
                  <img src={item.productImage} alt={item.productName} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.productName}</p>
                  <p className="text-xs text-muted">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="text-sm font-semibold">₱{((item.priceAtPurchase * item.quantity) / 100).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-subtle pt-4 text-lg font-bold">
          <span>Total</span>
          <span>₱{(order.total / 100).toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/products"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-flag-blue px-6 text-sm font-semibold text-white shadow-lg shadow-flag-blue/25 transition-all hover:brightness-90"
        >
          Mamalengke Ulit
        </Link>
      </div>
    </div>
  )
}

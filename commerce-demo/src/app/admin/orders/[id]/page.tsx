import { notFound } from 'next/navigation'
import { getOrder } from '@/lib/actions/orders'
import { FulfillmentActions } from './fulfillment-actions'
import { PaymentActions } from './payment-actions'
import { RiderAssignment } from './rider-assignment'
import { ReturnManagement } from './return-management'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const fulfillmentLabels: Record<string, string> = {
  unfulfilled: 'Kukunin pa lang',
  processing: 'Nasa tricycle',
  shipped: 'Nasa courier na',
  delivered: 'Nadeliver na',
  returned: 'Binalik',
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getOrder(id)
  if (!order) notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/admin/orders" className="text-sm text-muted transition-colors hover:text-muted">
        &larr; Back to Orders
      </Link>
      <h1 className="mt-4 font-[var(--font-display)] text-2xl font-bold">
        Order <span className="font-mono text-flag-blue">{order.orderNumber}</span>
      </h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-subtle p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Customer</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Name</dt>
              <dd>{order.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Email</dt>
              <dd>{order.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Mobile</dt>
              <dd>{order.mobile || '—'}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted">Address</dt>
              <dd className="text-xs">{order.barangay}, {order.city}, {order.province}, {order.region}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-subtle p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Status</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Payment</dt>
              <dd className={`font-medium uppercase ${order.paymentState === 'paid' ? 'text-leafy-green' : order.paymentState === 'refunded' ? 'text-flag-red' : 'text-flag-yellow'}`}>
                {order.paymentState.replace(/_/g, ' ')}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Method</dt>
              <dd className="font-medium uppercase">{order.paymentMethod}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Ref</dt>
              <dd className="font-mono text-xs">{order.paymentRef || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Status</dt>
              <dd className="font-medium">{fulfillmentLabels[order.fulfillmentState] ?? order.fulfillmentState}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Total</dt>
              <dd className="font-bold">₱{(order.total / 100).toFixed(2)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <FulfillmentActions orderId={order.id} currentState={order.fulfillmentState} />
      <PaymentActions orderId={order.id} currentState={order.paymentState} />
      <RiderAssignment orderId={order.id} currentRider={order.riderName} currentEta={order.eta} />
      <ReturnManagement orderId={order.id} />

      <div className="mt-8 rounded-xl border border-subtle p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Items</h2>
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
      </div>
    </div>
  )
}

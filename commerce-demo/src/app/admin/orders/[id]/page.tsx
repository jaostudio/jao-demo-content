import { notFound } from 'next/navigation'
import { getOrder } from '@/lib/actions/orders'
import { FulfillmentActions } from './fulfillment-actions'
import { PaymentActions } from './payment-actions'

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
      <h1 className="text-2xl font-bold tracking-tight">
        Order {order.orderNumber}
      </h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
          <h2 className="text-lg font-semibold">Customer</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-neutral-500">Name</dt>
              <dd>{order.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Email</dt>
              <dd>{order.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Address</dt>
              <dd className="text-right max-w-xs truncate">{order.address}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
          <h2 className="text-lg font-semibold">Status</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-neutral-500">Payment</dt>
              <dd className="capitalize font-medium">{order.paymentState.replace(/_/g, ' ')}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Fulfillment</dt>
              <dd className="capitalize font-medium">{order.fulfillmentState.replace(/_/g, ' ')}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Total</dt>
              <dd className="font-bold">${(order.total / 100).toFixed(2)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <FulfillmentActions orderId={order.id} currentState={order.fulfillmentState} />
      <PaymentActions orderId={order.id} currentState={order.paymentState} />

      <div className="mt-8 rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
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
      </div>
    </div>
  )
}

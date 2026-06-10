import Link from 'next/link'
import { getOrders } from '@/lib/actions/orders'

export const dynamic = 'force-dynamic'

const fulfillmentLabels: Record<string, string> = {
  unfulfilled: 'Kukunin pa lang',
  processing: 'Nasa tricycle',
  shipped: 'Nasa courier na',
  delivered: 'Nadeliver na',
  returned: 'Binalik',
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-[var(--font-display)] text-2xl font-bold">Orders / Orders</h1>

      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-subtle text-left">
              <th scope="col" className="pb-3 font-medium text-muted">Order</th>
              <th scope="col" className="pb-3 font-medium text-muted">Customer</th>
              <th scope="col" className="pb-3 font-medium text-muted">Total</th>
              <th scope="col" className="pb-3 font-medium text-muted">Payment</th>
              <th scope="col" className="pb-3 font-medium text-muted">Status</th>
              <th scope="col" className="pb-3 font-medium text-muted">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-subtle dark:border-stone-800">
                <td className="py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-mono text-xs text-flag-blue hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="py-3">
                  <div className="font-medium">{order.name}</div>
                  <div className="text-xs text-muted">{order.email}</div>
                </td>
                <td className="py-3 font-semibold">₱{(order.total / 100).toFixed(2)}</td>
                <td className="py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    order.paymentState === 'paid'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : order.paymentState === 'refunded'
                      ? 'bg-flag-red/10 text-flag-red'
                      : 'bg-flag-yellow/20 text-flag-yellow'
                  }`}>
                    {order.paymentState.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="py-3">
                  <span className="inline-flex rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium dark:bg-surface">
                    {fulfillmentLabels[order.fulfillmentState] ?? order.fulfillmentState}
                  </span>
                </td>
                <td className="py-3 text-xs text-muted">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted">
                  Wala pang orders.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

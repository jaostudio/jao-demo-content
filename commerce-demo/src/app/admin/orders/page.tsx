import Link from 'next/link'
import { getOrders } from '@/lib/actions/orders'

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Order Management</h1>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left dark:border-neutral-800">
              <th className="pb-3 font-medium text-neutral-500">Order</th>
              <th className="pb-3 font-medium text-neutral-500">Customer</th>
              <th className="pb-3 font-medium text-neutral-500">Total</th>
              <th className="pb-3 font-medium text-neutral-500">Payment</th>
              <th className="pb-3 font-medium text-neutral-500">Fulfillment</th>
              <th className="pb-3 font-medium text-neutral-500">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-neutral-100 dark:border-neutral-900">
                <td className="py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-mono text-xs hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="py-3">
                  <div>{order.name}</div>
                  <div className="text-xs text-neutral-500">{order.email}</div>
                </td>
                <td className="py-3 font-semibold">${(order.total / 100).toFixed(2)}</td>
                <td className="py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    order.paymentState === 'paid'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : order.paymentState === 'refunded'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {order.paymentState.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    order.fulfillmentState === 'fulfilled'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : order.fulfillmentState === 'returned'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : order.fulfillmentState === 'processing'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                  }`}>
                    {order.fulfillmentState.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="py-3 text-xs text-neutral-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-neutral-500">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

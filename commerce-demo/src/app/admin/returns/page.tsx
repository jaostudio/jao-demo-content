import { getReturnRequests } from '@/lib/actions/returns'
import { ReturnActions } from './return-actions'

export const dynamic = 'force-dynamic'

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
}

export default async function AdminReturnsPage() {
  const result = await getReturnRequests()
  const returns = result.success ? (result.returnRequests ?? []) : []

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-[var(--font-display)] text-2xl font-bold">Return Requests</h1>
      <p className="mt-1 text-sm text-muted">Review and manage customer return requests.</p>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-subtle text-left">
              <th scope="col" className="pb-3 font-medium text-muted">Order</th>
              <th scope="col" className="pb-3 font-medium text-muted">Customer</th>
              <th scope="col" className="pb-3 font-medium text-muted">Reason</th>
              <th scope="col" className="pb-3 font-medium text-muted">Status</th>
              <th scope="col" className="pb-3 font-medium text-muted">Date</th>
              <th scope="col" className="pb-3 font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {returns.map((r: any) => (
              <tr key={r.id} className="border-b border-subtle">
                <td className="py-3 font-mono text-xs text-flag-blue">{r.order?.orderNumber ?? r.orderId.slice(0, 8)}</td>
                <td className="py-3 font-medium">{r.order?.name ?? '-'}</td>
                <td className="py-3 text-muted max-w-xs truncate">{r.reason}</td>
                <td className="py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    r.status === 'approved' ? 'bg-green-100 text-green-700' :
                    r.status === 'rejected' ? 'bg-flag-red/10 text-flag-red' :
                    'bg-flag-yellow/20 text-flag-yellow'
                  }`}>
                    {statusLabels[r.status] ?? r.status}
                  </span>
                </td>
                <td className="py-3 text-xs text-muted">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="py-3">
                  <ReturnActions returnId={r.id} status={r.status} />
                </td>
              </tr>
            ))}
            {returns.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted">No return requests yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

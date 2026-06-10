import { TableRowSkeleton } from '@/components/ui/skeleton'

export default function AdminOrdersLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="h-8 w-56 animate-pulse-soft rounded bg-subtle dark:bg-surface" />
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-subtle text-left">
              {['Order', 'Customer', 'Total', 'Payment', 'Status', 'Date'].map((h) => (
                <th key={h} className="pb-3 font-medium text-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
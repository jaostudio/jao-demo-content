export default function AdminLoading() {
  return (
    <div className="space-y-4">
      <div className="h-6 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg border border-border bg-card dark:border-border-dark dark:bg-card-dark" />
        ))}
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg border border-border bg-card dark:border-border-dark dark:bg-card-dark" />
        ))}
      </div>
    </div>
  )
}

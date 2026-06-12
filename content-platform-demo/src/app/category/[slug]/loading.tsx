export default function CategoryLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-4">
      <div className="mb-4 space-y-2">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-20 animate-pulse rounded bg-slate-100 dark:bg-slate-700" />
      </div>
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg border border-border bg-card dark:border-border-dark dark:bg-card-dark" />
        ))}
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-4">
      <div className="space-y-3">
        <div className="mb-4 h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-3 rounded-lg border border-border bg-card p-3 dark:border-border-dark dark:bg-card-dark">
            <div className="h-16 w-16 shrink-0 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-700" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

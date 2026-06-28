export default function WorkLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-4">
      <div className="space-y-4">
        <div className="h-5 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-8 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-700" />
        <div className="space-y-2 pt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-3 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-700" />
          ))}
        </div>
      </div>
    </div>
  )
}

interface ChartSectionProps {
  categoryData: { name: string; articles: number }[]
  statusData: { name: string; value: number; color: string }[]
}

export function ChartSection({ categoryData, statusData }: ChartSectionProps) {
  const maxArticles = Math.max(...categoryData.map((d) => d.articles), 1)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-lg border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark">
        <h2 className="mb-3 text-xs font-bold text-text-primary dark:text-slate-100">Articles per Category</h2>
        <div className="space-y-2.5">
          {categoryData.map((cat) => (
            <div key={cat.name}>
              <div className="mb-1 flex justify-between text-[11px]">
                <span className="font-medium text-text-secondary">{cat.name}</span>
                <span className="text-text-muted">{cat.articles}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${(cat.articles / maxArticles) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark">
        <h2 className="mb-3 text-xs font-bold text-text-primary dark:text-slate-100">Status Breakdown</h2>
        <div className="flex h-[160px] items-end justify-center gap-3 pb-2">
          {statusData.map((entry) => (
            <div key={entry.name} className="flex flex-col items-center gap-1.5">
              <span className="text-xs font-bold text-text-primary dark:text-slate-100">{entry.value}</span>
              <div
                className="w-10 rounded-t transition-all"
                style={{
                  height: `${Math.max((entry.value / Math.max(...statusData.map((d) => d.value), 1)) * 120, 4)}px`,
                  backgroundColor: entry.color,
                }}
              />
              <span className="text-[10px] text-text-muted">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

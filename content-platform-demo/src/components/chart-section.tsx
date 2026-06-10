interface ChartSectionProps {
  categoryData: { name: string; articles: number }[]
  statusData: { name: string; value: number; color: string }[]
}

export function ChartSection({ categoryData, statusData }: ChartSectionProps) {
  const maxArticles = Math.max(...categoryData.map((d) => d.articles), 1)

  return (
    <div className="mb-8 grid gap-6 lg:grid-cols-2">
      <div className="border-2 border-black bg-cream p-6 nb-shadow dark:border-white dark:bg-black">
        <h2 className="mb-4 font-display text-sm font-bold text-black dark:text-white">Articles per Category</h2>
        <div className="space-y-3">
          {categoryData.map((cat) => (
            <div key={cat.name}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="font-bold text-black dark:text-white">{cat.name}</span>
                <span className="text-neutral-500">{cat.articles}</span>
              </div>
              <div className="h-3 overflow-hidden border border-black dark:border-white">
                <div
                  className="h-full bg-saffron-500 chart-bar-wobbly transition-all"
                  style={{ width: `${(cat.articles / maxArticles) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-2 border-black bg-cream p-6 nb-shadow dark:border-white dark:bg-black">
        <h2 className="mb-4 font-display text-sm font-bold text-black dark:text-white">Status Breakdown</h2>
        <div className="flex h-[200px] items-end justify-center gap-3 pb-2">
          {statusData.map((entry) => (
            <div key={entry.name} className="flex flex-col items-center gap-2">
              <span className="font-display text-sm font-bold text-black dark:text-white">{entry.value}</span>
              <div
                className="w-12 border-2 border-black chart-bar-wobbly transition-all dark:border-white"
                style={{
                  height: `${Math.max((entry.value / Math.max(...statusData.map((d) => d.value), 1)) * 140, 4)}px`,
                  backgroundColor: entry.color,
                }}
              />
              <span className="text-xs text-neutral-500">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

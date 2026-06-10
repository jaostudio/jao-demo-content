export default function CategoryLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 animate-pulse space-y-2">
        <div className="h-9 w-48 rounded-none border-2 border-black bg-saffron-100 dark:border-white dark:bg-saffron-900/20" />
        <div className="h-4 w-24 rounded-none border border-black/10 bg-cream dark:border-white/10 dark:bg-[#1A1A1A]" />
      </div>
      <div className="grid animate-pulse gap-6 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-40 rounded-none border-2 border-black bg-cream dark:border-white dark:bg-[#1A1A1A]" />
        ))}
      </div>
    </div>
  )
}

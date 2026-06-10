export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-3 h-10 w-48 animate-pulse rounded-none border-2 border-black bg-saffron-100 dark:border-white dark:bg-saffron-900/20" />
        <div className="mx-auto h-5 w-80 animate-pulse rounded-none border border-black/10 bg-cream dark:border-white/10 dark:bg-[#1A1A1A]" />
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 w-24 animate-pulse rounded-none border-2 border-black bg-cream dark:border-white dark:bg-[#1A1A1A]" />
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-none border-2 border-black bg-cream dark:border-white dark:bg-[#1A1A1A]" />
        ))}
      </div>
    </main>
  )
}

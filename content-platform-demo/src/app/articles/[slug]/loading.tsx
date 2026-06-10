export default function ArticleLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-6 animate-pulse space-y-4">
        <div className="h-5 w-24 rounded-none border-2 border-black bg-saffron-100 dark:border-white dark:bg-saffron-900/20" />
        <div className="h-10 w-3/4 rounded-none border-2 border-black bg-cream dark:border-white dark:bg-[#1A1A1A]" />
        <div className="h-4 w-1/2 rounded-none border border-black/10 bg-cream dark:border-white/10 dark:bg-[#1A1A1A]" />
      </div>
      <div className="animate-pulse space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 w-full rounded-none border border-black/10 bg-cream dark:border-white/10 dark:bg-[#1A1A1A]" />
        ))}
      </div>
    </div>
  )
}

export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded-none border-2 border-black bg-saffron-100 dark:border-white dark:bg-saffron-900/20" />
      <div className="grid grid-cols-3 gap-4">
        <div className="h-24 rounded-none border-2 border-black bg-cream dark:border-white dark:bg-[#1A1A1A]" />
        <div className="h-24 rounded-none border-2 border-black bg-cream dark:border-white dark:bg-[#1A1A1A]" />
        <div className="h-24 rounded-none border-2 border-black bg-cream dark:border-white dark:bg-[#1A1A1A]" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-none border-2 border-black bg-cream dark:border-white dark:bg-[#1A1A1A]" />
        ))}
      </div>
    </div>
  )
}

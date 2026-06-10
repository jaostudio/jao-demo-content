'use client'

export default function CategoryError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="mb-2 font-display text-lg font-bold">Could not load this category</p>
      <p className="mb-6 text-sm text-neutral-500">Something went wrong on our end.</p>
      <button onClick={reset} className="rounded-none border-2 border-black bg-black px-6 py-2 text-sm font-bold text-saffron-500 hover:nb-shadow dark:border-white dark:bg-white dark:text-black">
        Try again
      </button>
    </div>
  )
}

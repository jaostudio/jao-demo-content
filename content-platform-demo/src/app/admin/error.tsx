'use client'

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="mb-2 text-lg font-bold text-text-primary dark:text-slate-100">Something went wrong</p>
      <p className="mb-6 text-sm text-text-muted">The admin dashboard hit an error.</p>
      <button onClick={reset} className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover">
        Try again
      </button>
    </div>
  )
}

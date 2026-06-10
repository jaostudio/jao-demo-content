'use client'

export default function AdminOrdersError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 text-center">
      <span className="text-6xl">🐟</span>
      <h1 className="mt-6 text-2xl font-bold">Hala, nag-error sa admin panel!</h1>
      <p className="mt-2 text-muted">Baka umuulan — restart mo ang modem.</p>
      <div className="mt-6 flex justify-center">
        <button onClick={reset} className="inline-flex h-11 items-center justify-center rounded-xl bg-flag-blue px-6 text-sm font-semibold text-white shadow-lg shadow-flag-blue/25 transition-all hover:brightness-90">
          Try Again
        </button>
      </div>
    </div>
  )
}
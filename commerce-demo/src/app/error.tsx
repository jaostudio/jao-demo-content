'use client'

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-page-bg p-4">
        <div className="max-w-md text-center">
          <span className="text-6xl">😵</span>
          <h1 className="mt-4 font-[var(--font-display)] text-2xl font-bold">Hala, nag-error!</h1>
          <p className="mt-2 text-sm text-muted">Baka umuulan — i-restart mo ang modem.</p>
          <button onClick={reset} className="mt-6 rounded-xl bg-flag-blue px-6 py-3 text-sm font-semibold text-white hover:brightness-90">
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}

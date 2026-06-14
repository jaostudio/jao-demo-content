import Link from 'next/link'

export default function NotFound() {
  return (
    <>
      <header className="border-b border-border bg-card dark:border-border-dark dark:bg-card-dark">
        <div className="mx-auto flex h-12 max-w-5xl items-center px-4">
          <Link href="/" className="text-lg font-semibold text-primary">Likha</Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-24 text-center">
        <h1 className="mb-2 text-5xl font-semibold text-text-primary dark:text-slate-100">404</h1>
        <p className="mb-4 text-sm text-text-muted">Hindi namin mahanap ang pahinang ito.</p>
        <Link href="/" className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover">Bumalik sa homepage</Link>
      </main>
    </>
  )
}

import Link from 'next/link'

export default function CommerceHome() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Commerce Demo</h1>
      <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
        Full e-commerce lifecycle: product catalog, cart, checkout, payments, and order management.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/products"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-neutral-900 px-8 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Browse Products
        </Link>
        <Link
          href="/admin/orders"
          className="inline-flex h-12 items-center justify-center rounded-xl border border-neutral-200 bg-white px-8 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-900"
        >
          Admin Dashboard
        </Link>
      </div>
    </main>
  )
}

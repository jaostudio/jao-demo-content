import Link from 'next/link'

export default function NotFound() {
  return (
    <>
      <header className="border-b-2 border-black bg-cream dark:border-white dark:bg-[#1A1A1A]">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-4">
          <Link href="/" className="font-display text-lg font-bold tracking-tight">Likha</Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-24 text-center">
        <h1 className="mb-3 font-display text-6xl font-bold text-saffron-500">404</h1>
        <p className="mb-6 text-lg font-bold text-neutral-600">Hindi namin mahanap ang pahinang ito.</p>
        <Link href="/" className="rounded-none border-2 border-black bg-black px-5 py-2.5 text-sm font-bold text-saffron-500 hover:nb-shadow dark:border-white dark:bg-white dark:text-black">Bumalik sa homepage</Link>
      </main>
    </>
  )
}

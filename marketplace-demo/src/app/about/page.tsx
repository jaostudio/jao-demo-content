import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-4xl font-bold text-neutral-800 dark:text-neutral-100">About Likha</h1>
      <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
        Likha is a multi-vendor marketplace connecting buyers with authentic Filipino artisan makers.
        Our platform showcases handwoven textiles, pottery, woodcraft, artisan food, and more —
        direct from island makers to your doorstep.
      </p>
      <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
        Every purchase supports local craftsmanship and helps preserve generations-old Filipino traditions.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-10 items-center rounded-xl bg-primary-500 px-5 text-sm font-semibold text-white hover:bg-primary-600"
      >
        Back to home
      </Link>
    </div>
  )
}

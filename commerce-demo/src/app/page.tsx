import Link from 'next/link'
import { getCategories, getFeaturedProducts } from '@/lib/products'
import { getLang } from '@/lib/lang'

export const dynamic = 'force-dynamic'

const CAT_COLORS = ['flag-blue', 'flag-red', 'flag-yellow'] as const

const COLLAGE = [
  { rotation: 'rotate-2', y: '' },
  { rotation: '-rotate-6', y: 'translate-y-4' },
  { rotation: 'rotate-6', y: '-translate-y-2' },
  { rotation: '-rotate-3', y: 'translate-y-2' },
]

export default async function SariSariHome() {
  const lang = await getLang()
  const [categories, featured] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ])

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-20">
        {/* Watermark stamp */}
        <div className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden">
          <span className="text-[clamp(6rem,15vw,14rem)] font-black tracking-[0.3em] text-flag-blue/[0.03]">
            SARI-SARI
          </span>
        </div>

        {/* Background gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,56,168,0.10)_0%,rgba(206,17,38,0.05)_50%,rgba(249,212,0,0.10)_100%)]" />

        {/* Content */}
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-3">
            {/* Left: hero text */}
            <div className="text-center lg:col-span-2 lg:text-left">
              <span className="inline-flex rounded-full bg-flag-blue/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-flag-blue">
                {lang === 'tl' ? 'Bukas na ang Sari-Sari!' : 'Open na ang Sari-Sari!'}
              </span>
              <h1 className="mt-6 font-[var(--font-display)] text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                {lang === 'tl' ? 'Isang tindahan,' : 'One store,'}{' '}
                <span className="text-flag-red">{lang === 'tl' ? 'libong paninda' : 'a thousand items'}</span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted lg:mx-0">
                {lang === 'tl'
                  ? 'Nostalgic na chichirya, pancit canton, at mga paborito mo — straight from the corner store to your door.'
                  : 'Nostalgic snacks, pancit canton, and your favorites — straight from the corner store to your door.'}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
                <Link
                  href="/products"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-flag-blue px-8 text-sm font-semibold text-white shadow-lg shadow-flag-blue/25 transition-all hover:brightness-90 active:scale-[0.99]"
                >
                  {lang === 'tl' ? 'Mamili Na!' : 'Shop Now!'}
                </Link>
                <Link
                   href="/products?category=chichirya"
                   className="inline-flex h-12 items-center justify-center rounded-xl border border-subtle bg-white px-8 text-sm font-semibold text-foreground transition-all hover:bg-surface dark:bg-surface dark:text-foreground dark:border-muted"
                 >
                   {lang === 'tl' ? 'Chichirya' : 'Snacks'}
                </Link>
              </div>
            </div>

            {/* Right: product collage (desktop only) */}
            <div className="hidden gap-3 overflow-hidden lg:grid lg:grid-cols-2">
              {featured.map((p, i) => (
                <div
                  key={p.slug}
                  className={`overflow-hidden rounded-xl border border-subtle/50 shadow-lg transition-transform hover:scale-[1.02] ${COLLAGE[i].rotation} ${COLLAGE[i].y}`}
                >
                  <img
                    src={p.image}
                    alt=""
                    className="aspect-square h-full w-full object-cover"
                    aria-hidden
                    loading="eager"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-baseline justify-between">
          <h2 className="font-[var(--font-display)] text-2xl font-bold">
            <span className="inline-block h-2 w-2 rounded-full bg-flag-blue align-middle" />{' '}
            {lang === 'tl' ? 'Ano ang hanap mo?' : 'What are you looking for?'}
          </h2>
          <Link href="/products" className="text-sm font-medium text-muted transition-colors hover:underline">
            {lang === 'tl' ? 'Tingnan lahat' : 'View all'} &rarr;
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat, i) => {
            const color = CAT_COLORS[i % 3]
            return (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center gap-2 rounded-xl border border-subtle bg-surface p-6 text-center transition-all hover:border-flag-blue/30 hover:shadow-md dark:border-subtle dark:bg-surface"
              >
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full bg-${color}/10`}>
                  <span className="text-xl">
                    {cat.slug === 'chichirya' && '🍿'}
                    {cat.slug === 'noodles-pantry' && '🍜'}
                    {cat.slug === 'candies' && '🍬'}
                    {cat.slug === 'beverages' && '🥤'}
                    {cat.slug === 'household' && '🧺'}
                    {cat.slug === 'biscuits' && '🍪'}
                  </span>
                </span>
                <span className="text-sm font-semibold text-foreground">{lang === 'tl' ? cat.nameTl : cat.nameEn}</span>
                <span className="text-xs text-muted">{lang === 'tl' ? cat.nameEn : cat.nameTl}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-subtle bg-surface py-16 dark:border-subtle dark:bg-surface">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-flag-blue/10">
                <span className="text-2xl">🛒</span>
              </span>
              <h3 className="mt-3 font-semibold">{lang === 'tl' ? 'Libreng Hatch' : 'Free Delivery'}</h3>
              <p className="mt-1 text-sm text-muted">{lang === 'tl' ? 'Libreng delivery sa orders na ₱499 pataas' : 'Free delivery on orders over ₱499'}</p>
            </div>
            <div className="text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-flag-red/10">
                <span className="text-2xl">💚</span>
              </span>
              <h3 className="mt-3 font-semibold">{lang === 'tl' ? 'Bayad Pagdating' : 'Pay on Delivery'}</h3>
              <p className="mt-1 text-sm text-muted">{lang === 'tl' ? 'Cash on delivery o GCash' : 'Cash on delivery or GCash'}</p>
            </div>
            <div className="text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-flag-yellow/10">
                <span className="text-2xl">🥚</span>
              </span>
              <h3 className="mt-3 font-semibold">{lang === 'tl' ? 'Suki Points' : 'Suki Points'}</h3>
              <p className="mt-1 text-sm text-muted">{lang === 'tl' ? 'Kumita ng points sa bawat bilihin' : 'Earn points with every purchase'}</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}

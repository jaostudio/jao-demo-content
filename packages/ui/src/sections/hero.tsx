import type { HeroData } from '@jaostudio/engine/types'

export function HeroSection({ data }: { data: HeroData }) {
  return (
    <section className="relative overflow-hidden px-4 py-24">
      <div className="mx-auto max-w-6xl text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">{data.title}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
          {data.subtitle}
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href={data.cta.href}
            className="rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {data.cta.label}
          </a>
          {data.secondaryCta && (
            <a
              href={data.secondaryCta.href}
              className="rounded-lg border border-neutral-300 px-6 py-3 text-sm font-medium transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:hover:bg-neutral-800"
            >
              {data.secondaryCta.label}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

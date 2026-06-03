import type { ServiceData } from '@jaostudio/engine/types'

export function ServicesSection({ data }: { data: ServiceData }) {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold">{data.headline}</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-neutral-200 p-6 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
            >
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-neutral-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

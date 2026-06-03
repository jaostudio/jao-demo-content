import type { ProofData } from '@jaostudio/engine/types'

export function ProofSection({ data }: { data: ProofData }) {
  return (
    <section className="border-y border-neutral-200 px-4 py-16 dark:border-neutral-800">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-medium uppercase tracking-wider text-neutral-500">
          {data.headline}
        </p>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {data.items.map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-3xl font-bold">{item.value}</div>
              <div className="mt-1 text-sm text-neutral-500">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

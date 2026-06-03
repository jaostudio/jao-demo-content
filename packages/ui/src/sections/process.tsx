import type { ProcessData } from '@jaostudio/engine/types'

export function ProcessSection({ data }: { data: ProcessData }) {
  return (
    <section className="bg-neutral-50 px-4 py-20 dark:bg-neutral-900">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold">{data.headline}</h2>
        <div className="mt-12 space-y-8">
          {data.steps.map((step, i) => (
            <div key={step.title} className="flex gap-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold text-white dark:bg-white dark:text-neutral-900">
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-neutral-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

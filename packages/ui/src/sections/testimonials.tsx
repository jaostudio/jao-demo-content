import type { TestimonialData } from '@jaostudio/engine/types'

export function TestimonialsSection({ data }: { data: TestimonialData }) {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold">{data.headline}</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {data.items.map((t) => (
            <div key={t.author} className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
              <p className="text-sm italic text-neutral-600 dark:text-neutral-400">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                <p className="text-sm font-semibold">{t.author}</p>
                <p className="text-xs text-neutral-500">
                  {t.role}{t.company ? `, ${t.company}` : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

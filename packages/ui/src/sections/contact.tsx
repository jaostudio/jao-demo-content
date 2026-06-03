import type { ContactData } from '@jaostudio/engine/types'

export function ContactSection({ data }: { data: ContactData }) {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold">{data.headline}</h2>
        <p className="mt-4 text-neutral-600 dark:text-neutral-400">{data.subtitle}</p>
        <div className="mt-8">
          <a
            href={data.email ? `mailto:${data.email}` : '#contact'}
            className="inline-block rounded-lg bg-neutral-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {data.cta}
          </a>
        </div>
        {(data.email || data.phone) && (
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-neutral-500">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>{data.phone}</span>}
          </div>
        )}
      </div>
    </section>
  )
}

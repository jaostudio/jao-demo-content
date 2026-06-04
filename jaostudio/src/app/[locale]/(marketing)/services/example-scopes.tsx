import { getTranslations } from 'next-intl/server'

export async function ExampleScopes() {
  const t = await getTranslations('services')

  const examples = [1, 2, 3] as const

  return (
    <section className="mt-16">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
          {t('exampleScopes')}
        </h2>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {examples.map((i) => (
          <div key={i} className="rounded-xl border border-border-subtle bg-bg-surface p-5">
            <p className="text-sm font-medium text-text-primary">{t(`example${i}Title`)}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-accent">
              {t(`example${i}Timeline`)}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              {t(`example${i}Scope`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

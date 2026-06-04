import { getTranslations } from 'next-intl/server'

export async function EngagementModels() {
  const t = await getTranslations('services')

  const models = [1, 2, 3, 4] as const

  return (
    <section className="mt-16">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
          {t('engagementModel')}
        </h2>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {models.map((i) => (
          <div key={i} className="rounded-xl border border-border-subtle bg-bg-surface p-5">
            <p className="text-sm font-medium text-text-primary">{t(`model${i}Title`)}</p>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">{t(`model${i}Desc`)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

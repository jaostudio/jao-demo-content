import { getTranslations } from 'next-intl/server'

export async function DeliveryStages() {
  const t = await getTranslations('services')

  const stages = [1, 2, 3, 4, 5] as const

  return (
    <section className="mt-16">
      <div className="flex flex-col items-center text-center">
        <p className="text-[10px] font-medium uppercase tracking-widest text-accent">
          {t('processBadge')}
        </p>
        <h2 className="mt-2 text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
          {t('deliveryStages')}
        </h2>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-5">
        {stages.map((i) => (
          <div key={i} className="rounded-xl border border-border-subtle bg-bg-surface p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[11px] font-medium text-white">
                {i}
              </span>
              <p className="text-sm font-medium text-text-primary">{t(`stage${i}Title`)}</p>
            </div>
            <p className="mt-2 text-[10px] uppercase tracking-wider text-text-tertiary">
              {t('timeline')}
            </p>
            <p className="mt-0.5 text-xs text-text-tertiary">{t(`stage${i}Timeline`)}</p>
            <div className="mt-3">
              <p className="text-[10px] font-medium text-text-secondary">{t('output')}</p>
              <p className="text-xs text-text-tertiary">{t(`stage${i}Output`)}</p>
            </div>
            <div className="mt-2">
              <p className="text-[10px] font-medium text-text-secondary">{t('fromYou')}</p>
              <p className="text-xs text-text-tertiary">{t(`stage${i}Input`)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

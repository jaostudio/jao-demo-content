import { getTranslations } from 'next-intl/server'

export async function AvailabilitySection() {
  const t = await getTranslations('services')

  return (
    <section className="mt-16 rounded-xl border border-border-subtle bg-bg-surface p-6 lg:p-8">
      <h2 className="text-[var(--text-card-title)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
        {t('availabilityNote')}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        {t('availabilityIntro')}
      </p>
      <ul className="mt-4 space-y-2">
        {[1, 2, 3].map((i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
            {t(`availabilityNote${i}`)}
          </li>
        ))}
      </ul>
    </section>
  )
}

import { getTranslations } from 'next-intl/server'
import { Badge } from '@/components/typography/badge'
import { Section } from '@/components/ui/section'

export async function AvailabilitySection() {
  const t = await getTranslations('services')

  return (
    <Section density="compact" id="availability">
      <div className="flex flex-col items-center text-center">
        <Badge variant="accent">{t('availabilityBadge')}</Badge>
        <h2 className="mt-2 text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
          {t('availabilityTitle')}
        </h2>
        <p className="mt-2 max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
          {t('availabilityIntro')}
        </p>
      </div>
      <ul className="mt-6 space-y-2">
        {[1, 2, 3].map((i) => (
          <li key={i} className="flex items-start gap-2 text-base text-text-secondary">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
            {t(`availabilityNote${i}`)}
          </li>
        ))}
      </ul>
    </Section>
  )
}

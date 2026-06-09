import { getTranslations } from 'next-intl/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/typography/badge'
import { FadeInView } from '@/components/animations/fade-in-view'
import { Section } from '@/components/ui/section'

export async function EngagementModels() {
  const t = await getTranslations('services')

  const models = [1, 2, 3, 4] as const

  return (
    <Section density="compact" id="engagement-models">
      <div className="flex flex-col items-center text-center">
        <Badge variant="accent">{t('engagementBadge')}</Badge>
        <h2 className="mt-2 text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
          {t('engagementModel')}
        </h2>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {models.map((i) => (
          <FadeInView key={i} delay={(i - 1) * 0.1}>
            <Card className="p-5">
              <p className="text-sm font-medium text-text-primary">{t(`model${i}Title`)}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-text-secondary">
                {t('bestFor')}: {t(`model${i}BestFor`)}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {t(`model${i}Desc`)}
              </p>
            </Card>
          </FadeInView>
        ))}
      </div>
    </Section>
  )
}

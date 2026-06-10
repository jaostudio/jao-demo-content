import { getTranslations } from 'next-intl/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/typography/badge'
import { FadeInView } from '@/components/animations/fade-in-view'
import { Section } from '@/components/ui/section'

export async function ExampleScopes() {
  const t = await getTranslations('services')

  const examples = [1, 2, 3] as const

  return (
    <Section density="compact" id="example-scopes">
      <div className="flex flex-col items-center text-center">
        <Badge variant="accent">{t('exampleScopesBadge')}</Badge>
        <h2 className="mt-2 text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
          {t('exampleScopes')}
        </h2>
      </div>
      <div
        className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        role="list"
        aria-label="Example scopes"
      >
        {examples.map((i) => (
          <div key={i}>
            <FadeInView delay={(i - 1) * 0.1}>
            <Card className="p-4 md:p-5">
              <p className="text-sm font-medium text-text-primary">{t(`example${i}Title`)}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-text-secondary">
                {t(`example${i}Timeline`)}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {t(`example${i}Scope`)}
              </p>
              <div className="mt-3 border-t border-border-subtle pt-3">
                <p className="text-xs font-medium text-text-secondary">{t('result')}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-text-primary">
                  {t(`example${i}Result`)}
                </p>
              </div>
            </Card>
          </FadeInView>
          </div>
        ))}
      </div>
    </Section>
  )
}

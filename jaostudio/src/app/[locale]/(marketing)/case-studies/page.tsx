import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { resolveSEO } from '@/lib/seo/resolveSEO'
import { getPublishedCaseStudies } from '@/lib/case-studies'
import { FadeInView } from '@/components/animations/fade-in-view'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Badge } from '@/components/typography/badge'
import { Card } from '@/components/ui/card'
import { LayeredFrame } from '@/components/ui/layout/layered-frame'

export async function generateMetadata() {
  return resolveSEO({
    titleKey: 'seo.caseStudies.title',
    descriptionKey: 'seo.caseStudies.description',
  })
}

const badgeVariants = ['accent', 'default'] as const

export default async function CaseStudiesPage() {
  const t = await getTranslations('caseStudies')
  const caseStudies = getPublishedCaseStudies()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaostudio.dev' },
          { '@type': 'ListItem', position: 2, name: 'Case Studies', item: 'https://jaostudio.dev/case-studies' },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: 'Case Studies — JAOstudio',
        url: 'https://jaostudio.dev/case-studies',
        description: 'Real-world projects and outcomes.',
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <FadeInView><section className="relative pt-20 lg:pt-28">
        <LayeredFrame glow>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <Badge variant="accent">{t('badge')}</Badge>
            <h1 className="text-[var(--text-hero)] font-[var(--weight-medium)] leading-[var(--leading-display)] tracking-[var(--tracking-tight)] text-text-primary">
              {t('heading')}
            </h1>
            <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
              {t('description')}
            </p>
          </div>
        </LayeredFrame>
      </section></FadeInView>

      <Container>
        <Section density="compact">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((cs, i) => (
              <FadeInView key={cs.slug} delay={i * 0.1}>
              <Link
                href={`/case-studies/${cs.slug}`}
                className="group block"
              >
                <Card className="flex h-full flex-col">
                  <Badge variant={badgeVariants[i % badgeVariants.length]}>
                    {cs.industry}
                  </Badge>

                  <h2 className="mt-4 text-lg font-medium text-text-primary transition-colors group-hover:text-accent">
                    {cs.title}
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-text-secondary line-clamp-3">
                    {cs.outcome}
                  </p>

                  {cs.metrics && cs.metrics.length > 0 && (
                    <div className="mt-4 flex items-center gap-3 border-t border-border-subtle pt-4">
                      <span className="text-lg font-medium text-text-primary">{cs.metrics[0].value}</span>
                      <span className="text-xs text-text-tertiary">{cs.metrics[0].label}</span>
                    </div>
                  )}

                  <div className="mt-auto pt-4">
                    <span className="text-xs font-medium text-text-primary group-hover:underline underline-offset-4">
                      {t('readCaseStudy')} →
                    </span>
                  </div>
                </Card>
              </Link>
              </FadeInView>
            ))}
          </div>
        </Section>
      </Container>
    </>
  )
}

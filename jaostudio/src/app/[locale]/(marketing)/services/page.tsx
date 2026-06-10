import { Section } from '@/components/ui/section'
import { Badge } from '@/components/typography/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LayeredFrame } from '@/components/ui/layout/layered-frame'
import { FadeInView } from '@/components/animations/fade-in-view'
import { getTranslations } from 'next-intl/server'
import { ORG_ID } from '@/lib/json-ld-ids'
import { DeliveryStages } from './service-stages'
import { EngagementModels } from './engagement-models'
import { ExampleScopes } from './example-scopes'
import { AvailabilitySection } from './availability-section'

export async function generateMetadata() {
  const t = await getTranslations('services')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: 'https://jaostudio.dev/services' },
  }
}

const schemaJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Web Development Services',
      provider: { '@id': ORG_ID },
      areaServed: 'Worldwide',
      description: 'Custom websites, web applications, dashboards, and AI-enhanced tools.',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@position': 1, name: 'Home', item: 'https://jaostudio.dev' },
        { '@position': 2, name: 'Services', item: 'https://jaostudio.dev/services' },
      ],
    },
  ],
}

export default async function ServicesPage() {
  const t = await getTranslations('services')

  const services = [
    { title: t('service1Title'), desc: t('service1Desc') },
    { title: t('service2Title'), desc: t('service2Desc') },
    { title: t('service3Title'), desc: t('service3Desc') },
    { title: t('service4Title'), desc: t('service4Desc') },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      <FadeInView><section className="relative pt-20 lg:pt-28">
        <LayeredFrame glow>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <Badge variant="accent">{t('workingStyle')}</Badge>
            <h1 className="text-[var(--text-hero)] font-[var(--weight-medium)] leading-[var(--leading-display)] tracking-[var(--tracking-tight)] text-text-primary">
              {t('heroTitle')}
            </h1>
            <p className="max-w-lg text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
              {t('heroDesc')}
            </p>
          </div>
        </LayeredFrame>
      </section></FadeInView>

      <FadeInView><Section density="compact">
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((svc, i) => (
            <FadeInView key={svc.title} delay={i * 0.1}>
              <Card className="p-4 md:p-5">
                <p className="text-sm font-medium text-text-primary">{svc.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">{svc.desc}</p>
              </Card>
            </FadeInView>
          ))}
        </div>
      </Section></FadeInView>

      <FadeInView><Section density="compact">
        <Card className="border border-accent/20 bg-accent/5 p-4 md:p-6">
          <Badge variant="accent">{t('candidBadge')}</Badge>
          <p className="mt-3 text-[var(--text-body)] leading-relaxed text-text-secondary">
            {t('candidNote')}
          </p>
        </Card>
      </Section></FadeInView>

      <DeliveryStages />

      <EngagementModels />

      <ExampleScopes />

      <AvailabilitySection />

      <Section className="pb-32 md:pb-40">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="text-[var(--text-card-title)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
            {t('cta')}
          </h2>
          <p className="max-w-md text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
            {t('ctaSubtitle')}
          </p>
          <Button href="/contact" variant="primary" size="lg" trackingLabel="services_cta">
            {t('ctaButton')}
          </Button>
        </div>
      </Section>
    </>
  )
}


import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Badge } from '@/components/typography/badge'
import { Button } from '@/components/ui/button'
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

      <Section className="pt-32 md:pt-40">
        <Container className="mx-auto max-w-2xl">
          <div className="flex flex-col items-center gap-4 text-center">
            <Badge variant="accent">{t('workingStyle')}</Badge>
            <h1 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
              {t('heroBadge')}
            </h1>
            <p className="max-w-lg text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
              {t('heroDesc')}
            </p>
          </div>
        </Container>
      </Section>

      <Container className="mx-auto max-w-3xl">
        <Section density="compact">
          <div className="flex flex-col gap-4 items-center text-center">
            <Badge variant="default">{t('workingStyle')}</Badge>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {services.map((svc) => (
              <div
                key={svc.title}
                className="rounded-xl border border-border-subtle bg-bg-surface p-5"
              >
                <p className="text-sm font-medium text-text-primary">{svc.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">{svc.desc}</p>
              </div>
            ))}
          </div>
        </Section>
      </Container>

      <Container className="mx-auto max-w-5xl">
        <DeliveryStages />
      </Container>

      <Container className="mx-auto max-w-3xl">
        <EngagementModels />
      </Container>

      <Container className="mx-auto max-w-5xl">
        <ExampleScopes />
      </Container>

      <Container className="mx-auto max-w-3xl">
        <AvailabilitySection />
      </Container>

      <Container className="mx-auto max-w-3xl">
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
      </Container>
    </>
  )
}


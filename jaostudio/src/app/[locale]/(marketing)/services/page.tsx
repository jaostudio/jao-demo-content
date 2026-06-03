import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Badge } from '@/components/typography/badge'
import { Button } from '@/components/ui/button'
import { getTranslations } from 'next-intl/server'
import { ORG_ID } from '@/lib/json-ld-ids'

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
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaostudio.dev' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://jaostudio.dev/services' },
      ],
    },
  ],
}

export default async function ServicesPage() {
  const t = await getTranslations('services')

  const stages = [
    { title: t('stage1'), timeline: t('stage1Timeline'), output: t('stage1Output'), clientInput: t('stage1Input') },
    { title: t('stage2'), timeline: t('stage2Timeline'), output: t('stage2Output'), clientInput: t('stage2Input') },
    { title: t('stage3'), timeline: t('stage3Timeline'), output: t('stage3Output'), clientInput: t('stage3Input') },
    { title: t('stage4'), timeline: t('stage4Timeline'), output: t('stage4Output'), clientInput: t('stage4Input') },
    { title: t('stage5'), timeline: t('stage5Timeline'), output: t('stage5Output'), clientInput: t('stage5Input') },
  ]

  const models = [
    { title: t('model1Title'), desc: t('model1Desc') },
    { title: t('model2Title'), desc: t('model2Desc') },
    { title: t('model3Title'), desc: t('model3Desc') },
    { title: t('model4Title'), desc: t('model4Desc') },
  ]

  const services = [
    { title: t('service1Title'), desc: t('service1Desc') },
    { title: t('service2Title'), desc: t('service2Desc') },
    { title: t('service3Title'), desc: t('service3Desc') },
    { title: t('service4Title'), desc: t('service4Desc') },
  ]

  const examples = [
    { title: t('example1Title'), timeline: t('example1Timeline'), scope: t('example1Scope') },
    { title: t('example2Title'), timeline: t('example2Timeline'), scope: t('example2Scope') },
    { title: t('example3Title'), timeline: t('example3Timeline'), scope: t('example3Scope') },
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
            <Badge variant="accent">{t('processBadge')}</Badge>
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
            <Badge variant="default">{t('deliveryStages')}</Badge>
          </div>
          <div className="mt-8 flex flex-col gap-4">
            {stages.map((stage, i) => (
              <div
                key={stage.title}
                className="rounded-xl border border-border-subtle bg-bg-surface p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-subtle text-xs font-mono text-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="text-sm font-medium text-text-primary">{stage.title}</h2>
                  </div>
                  <span className="shrink-0 text-xs text-text-tertiary">{stage.timeline}</span>
                </div>
                <div className="mt-4 grid gap-3 pl-10 text-sm md:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">{t('output')}</p>
                    <p className="mt-1 text-text-secondary">{stage.output}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">{t('fromYou')}</p>
                    <p className="mt-1 text-text-secondary">{stage.clientInput}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </Container>

      <Container className="mx-auto max-w-3xl">
        <Section density="compact">
          <div className="flex flex-col gap-4 items-center text-center">
            <Badge variant="default">{t('engagementModel')}</Badge>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {models.map((m) => (
              <div
                key={m.title}
                className="rounded-xl border border-border-subtle bg-bg-surface p-5"
              >
                <p className="text-sm font-medium text-text-primary">{m.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">{m.desc}</p>
              </div>
            ))}
          </div>
        </Section>
      </Container>

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

      <Container className="mx-auto max-w-3xl">
        <Section density="compact">
          <div className="flex flex-col gap-4 items-center text-center">
            <Badge variant="default">{t('exampleScopes')}</Badge>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {examples.map((ex) => (
              <div
                key={ex.title}
                className="rounded-xl border border-border-subtle bg-bg-surface p-5"
              >
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-tertiary">{ex.timeline}</p>
                <h3 className="mt-2 text-sm font-medium text-text-primary">{ex.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">{ex.scope}</p>
              </div>
            ))}
          </div>
        </Section>
      </Container>

      <Container className="mx-auto max-w-3xl">
        <Section density="compact">
          <div className="flex flex-col gap-4 items-center text-center">
            <Badge variant="default">{t('availabilityNote')}</Badge>
            <p className="max-w-lg text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
              {t('availabilityIntro')}
            </p>
          </div>
          <div className="mt-8 grid gap-3 text-sm leading-relaxed text-text-secondary md:grid-cols-3">
            <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
              {t('availabilityNote1')}
            </div>
            <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
              {t('availabilityNote2')}
            </div>
            <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
              {t('availabilityNote3')}
            </div>
          </div>
        </Section>
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

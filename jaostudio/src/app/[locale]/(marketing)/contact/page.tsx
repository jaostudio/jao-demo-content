import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Badge } from '@/components/typography/badge'
import { Button } from '@/components/ui/button'
import { getTranslations } from 'next-intl/server'
import { ContactSection } from '@/components/sections/contact-section'
import { ContactFAQ } from '@/components/sections/contact-faq'
import { ORG_ID } from '@/lib/json-ld-ids'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact JAOstudio',
  url: 'https://jaostudio.dev/contact',
  description: 'Start a project or get in touch with JAOstudio.',
  mainEntity: { '@id': ORG_ID },
}

export default async function ContactPage() {
  const t = await getTranslations('contactPage')
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section className="pt-32 md:pt-40">
        <Container className="mx-auto max-w-2xl">
          <div className="flex flex-col items-center gap-4 text-center">
            <Badge variant="accent">{t('heading')}</Badge>
            <h1 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
              {t('heroHeading')}
            </h1>
            <p className="max-w-lg text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
              {t('description')}
            </p>
          </div>
        </Container>
      </Section>

      <Container className="mx-auto max-w-3xl">
        <Section density="compact">
          <div className="flex flex-col gap-4 items-center text-center">
            <Badge variant="default">{t('fitBadge')}</Badge>
            <p className="text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary max-w-lg">
              {t('fitDesc')}
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              { title: t('fit1') },
              { title: t('fit2') },
              { title: t('fit3') },
              { title: t('fit4') },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border-subtle bg-bg-surface p-5"
              >
                <p className="text-sm font-medium text-text-primary">{item.title}</p>
              </div>
            ))}
          </div>
        </Section>
      </Container>

      <Container className="mx-auto max-w-3xl">
        <Section density="compact">
          <div className="flex flex-col gap-4 items-center text-center">
            <Badge variant="default">{t('howItWorks')}</Badge>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { step: '01', title: t('step1') },
              { step: '02', title: t('step2') },
              { step: '03', title: t('step3') },
            ].map((s) => (
              <div key={s.step} className="flex flex-col gap-2">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent">{s.step}</span>
                <h3 className="text-sm font-medium text-text-primary">{s.title}</h3>
              </div>
            ))}
          </div>
        </Section>
      </Container>

      <Container className="mx-auto max-w-3xl">
        <Section density="compact">
          <div className="flex flex-col gap-4 items-center text-center">
            <Badge variant="default">{t('howCollaborationWorks')}</Badge>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              { title: t('model1'), desc: t('model1Desc') },
              { title: t('model2'), desc: t('model2Desc') },
              { title: t('model3'), desc: t('model3Desc') },
              { title: t('model4'), desc: t('model4Desc') },
              { title: t('model5'), desc: t('model5Desc') },
              { title: t('model6'), desc: t('model6Desc') },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border-subtle bg-bg-surface p-5"
              >
                <p className="text-sm font-medium text-text-primary">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </Section>
      </Container>

      <ContactSection />

      <Container className="mx-auto max-w-3xl">
        <Section density="compact">
          <div className="flex flex-col gap-4 items-center text-center">
            <Badge variant="default">{t('faq')}</Badge>
          </div>
          <div className="mt-8">
            <ContactFAQ />
          </div>
        </Section>
      </Container>

      <Container className="mx-auto max-w-3xl">
        <Section className="pb-32 md:pb-40">
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-border-subtle bg-bg-surface p-8 text-center">
            <p className="text-[var(--text-body)] font-medium text-text-primary">
              {t('ctaDirect')}
            </p>
            <Button href="/contact" variant="secondary" size="lg" trackingLabel="direct_contact_cta">
              {t('ctaEmail')}
            </Button>
          </div>
        </Section>
      </Container>
    </>
  )
}

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { resolveSEO } from '@/lib/seo/resolveSEO'
import { getCaseStudy } from '@/lib/case-studies'
import { getProject } from '@/lib/projects'
import { getService } from '@/lib/services'
import { SYSTEMS } from '@/lib/systems'
import { ORG_ID } from '@/lib/json-ld-ids'
import { FadeInView } from '@/components/animations/fade-in-view'
import { Container } from '@/components/ui/container'
import { LayeredFrame } from '@/components/ui/layout/layered-frame'
import { Badge } from '@/components/typography/badge'
import { Card } from '@/components/ui/card'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) return {}

  return resolveSEO({
    titleKey: 'seo.caseStudies.title',
    descriptionKey: 'seo.caseStudies.description',
  })
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) notFound()

  const project = getProject(cs.relatedProject)
  if (!project) notFound()

  const t = await getTranslations('caseStudies')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaostudio.dev' },
          { '@type': 'ListItem', position: 2, name: 'Case Studies', item: 'https://jaostudio.dev/case-studies' },
          { '@type': 'ListItem', position: 3, name: cs.title, item: `https://jaostudio.dev/case-studies/${cs.slug}` },
        ],
      },
      {
        '@type': 'Article',
        headline: cs.title,
        description: cs.outcome,
        author: { '@id': ORG_ID },
        publisher: { '@id': ORG_ID },
        datePublished: project.date,
        mainEntityOfPage: { '@type': 'WebPage', '@id': `https://jaostudio.dev/case-studies/${cs.slug}` },
        mentions: cs.relatedServices.map((sid) => ({ '@id': `https://jaostudio.dev/services#${sid}` })),
      },
    ],
  }

  const services = cs.relatedServices.map((sid) => getService(sid))
  const demos = SYSTEMS.filter((s) => cs.relatedDemos.includes(s.id))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <FadeInView><section className="relative pt-20 lg:pt-28">
        <LayeredFrame glow>
          <div className="flex flex-col gap-4 text-center md:text-left">
            <Badge variant="accent">{cs.industry}</Badge>
            <h1 className="text-[var(--text-hero)] font-[var(--weight-medium)] leading-[var(--leading-display)] tracking-[var(--tracking-tight)] text-text-primary">
              {cs.title}
            </h1>
            <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
              {cs.outcome}
            </p>
            {cs.metrics && cs.metrics.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-8">
                {cs.metrics.map((m) => (
                  <div key={m.label}>
                    <p className="text-2xl font-medium text-accent">{m.value}</p>
                    <p className="text-xs text-text-tertiary">{m.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </LayeredFrame>
      </section></FadeInView>

      <article className="mx-auto max-w-4xl px-6 py-20 md:px-8 lg:px-12">
        {/* Breadcrumb nav */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-text-tertiary">
          <Link href="/case-studies" className="underline-offset-4 transition-colors hover:text-text-primary hover:underline">
            {t('backLink')}
          </Link>
          <span className="opacity-30">/</span>
          <span className="text-text-secondary">{cs.title}</span>
        </nav>

        {/* Challenge */}
        <FadeInView><Section heading={t('sectionChallenge')}>
          <p className="text-[var(--text-body)] leading-relaxed text-text-secondary">{cs.challenge}</p>
        </Section></FadeInView>

        {/* Constraints */}
        <FadeInView><Section heading={t('sectionConstraints')}>
          <ul className="flex flex-col gap-4">
            {cs.constraints.map((c, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-text-secondary">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {c}
              </li>
            ))}
          </ul>
        </Section></FadeInView>

        {/* Solution */}
        <FadeInView><Section heading={t('sectionSolution')}>
          <p className="text-[var(--text-body)] leading-relaxed text-text-secondary">{cs.solution}</p>

          {project.systems?.architecture && (
            <Card className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wider text-text-primary">{t('architectureLabel')}</p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {cs.architectureSummary || project.systems.architecture}
              </p>
            </Card>
          )}
        </Section></FadeInView>

        {/* Key Features (from project) */}
        <FadeInView><Section heading={t('sectionFeatures')}>
          <div className="grid gap-3 sm:grid-cols-2">
            {project.deliverables.map((d, i) => (
              <FadeInView key={d} delay={i * 0.05}>
                <Card className="flex items-center gap-3">
                  <span className="text-accent">◆</span>
                  <span className="text-sm text-text-secondary">{d}</span>
                </Card>
              </FadeInView>
            ))}
          </div>
        </Section></FadeInView>

        {/* Lessons */}
        <FadeInView><Section heading={t('sectionLessons')}>
          <div className="flex flex-col gap-6">
            {cs.lessons.map((l, i) => (
              <FadeInView key={i} delay={i * 0.1}>
                <Card>
                  <p className="text-xs font-medium text-text-primary">{t('lessonLabel')} {i + 1}</p>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{l}</p>
                </Card>
              </FadeInView>
            ))}
          </div>
        </Section></FadeInView>

        {/* Related Services + Related Demo + Related Project */}
        <FadeInView><footer className="mt-20 border-t border-border-subtle pt-12">
          <div className="grid gap-8 md:grid-cols-3">
            {services.length > 0 && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-text-primary">{t('relatedServices')}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {services.map((s) => (
                    <span
                      key={s.id}
                      className="rounded-full border border-border-subtle px-3 py-1 text-xs text-text-secondary"
                    >
                      {s.slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {demos.length > 0 && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-text-primary">{t('relatedDemos')}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {demos.map((d) => (
                    <Link
                      key={d.id}
                      href={`/demos#${d.id}`}
                      className="rounded-full border border-border-subtle px-3 py-1 text-xs text-text-secondary transition-colors hover:border-accent/30 hover:text-accent"
                    >
                      {d.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-text-primary">{t('relatedProject')}</p>
              <Link
                href={`/projects/${project.slug}`}
                className="mt-3 block text-sm font-medium text-text-primary underline-offset-4 transition-colors hover:text-accent hover:underline"
              >
                {project.title} →
              </Link>
            </div>
          </div>

          {/* CTA */}
          <Card className="mt-12 flex flex-col items-center gap-4 p-8 text-center">
            <p className="text-[var(--text-body)] font-medium text-text-primary">
              {t('ctaTitle')}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-xl bg-text-primary px-6 py-3 text-sm font-medium text-bg-primary transition-opacity hover:opacity-90"
            >
              {t('ctaButton')}
            </Link>
          </Card>
        </footer></FadeInView>
      </article>
    </>
  )
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-[var(--text-card-title)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary mb-4">
        {heading}
      </h2>
      {children}
    </section>
  )
}

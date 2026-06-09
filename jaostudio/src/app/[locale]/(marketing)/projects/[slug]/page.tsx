import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { resolveSEO } from '@/lib/seo/resolveSEO'
import { buildOG } from '@/lib/seo/og'
import { FadeInView } from '@/components/animations/fade-in-view'
import { Container } from '@/components/ui/container'
import { LayeredFrame } from '@/components/ui/layout/layered-frame'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/typography/badge'
import { Card } from '@/components/ui/card'
import { Diagram } from '@/components/architecture'
import { PreviewRenderer } from '@/components/project-preview/preview-renderer'
import { PageScrollTracker } from '@/components/layout/page-scroll-tracker'
import { ProjectViewTracker } from '@/components/projects/project-view-tracker'
import { EVENTS } from '@/lib/analytics'
import { getProject, getRelatedProjects, projects } from '@/lib/projects'
import { getCaseStudiesByProject } from '@/lib/case-studies'
import { getService } from '@/lib/services'
import { SYSTEMS } from '@/lib/systems'
import { PERSON_ID } from '@/lib/json-ld-ids'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return projects.filter((p) => p.projectTier !== 'concept').map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return {}

  const title = `${project.title} — JAOstudio`
  const description = project.summary

  return {
    title,
    description,
    alternates: { canonical: `https://jaostudio.dev/projects/${slug}` },
    openGraph: buildOG({ title, description }),
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()
  const t = await getTranslations('projectDetail')

  const typeParam = project.projectType ?? project.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const contactHref = `/#contact?projectType=${encodeURIComponent(typeParam)}&source=${encodeURIComponent(project.slug)}`

  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Projects', item: 'https://jaostudio.dev/projects' },
          { '@type': 'ListItem', position: 2, name: project.title, item: `https://jaostudio.dev/projects/${slug}` },
        ],
      },
      {
        '@type': 'CreativeWork',
        name: project.title,
        description: project.summary,
        datePublished: project.date,
        author: { '@id': PERSON_ID },
        mainEntityOfPage: `https://jaostudio.dev/projects/${slug}`,
        about: project.businessContext.who,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <PageScrollTracker eventName={EVENTS.CASE_STUDY_SCROLL} />
      <ProjectViewTracker slug={slug} />
      <FadeInView><section className="relative flex min-h-[50vh] items-end overflow-hidden pt-20 lg:pt-28">
        <LayeredFrame glow>
          <div className="flex flex-col gap-4 pb-8 md:pb-12">
            <div className="flex items-center gap-3">
              <Badge variant="accent">{project.industry}</Badge>
              <Link
                href="/projects"
                className="text-[var(--text-meta)] text-text-secondary transition-colors hover:text-text-primary"
              >
                {t('backLink')}
              </Link>
            </div>
            <h1 className="text-[var(--text-hero)] font-[var(--weight-medium)] leading-[var(--leading-display)] tracking-[var(--tracking-tight)] text-text-primary">
              {project.title}
            </h1>
            <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
              {project.summary}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[var(--text-meta)] text-text-tertiary">
              <span>{project.industry}</span>
              <span className="text-text-tertiary/40">·</span>
              <span>{project.timeline}</span>
              <span className="text-text-tertiary/40">·</span>
              <span>{project.metrics.lighthouse}+ Lighthouse</span>
              <span className="text-text-tertiary/40">·</span>
              <span>{project.metrics.performance}</span>
            </div>
          </div>
        </LayeredFrame>
      </section></FadeInView>

      <Container className="pb-12">
        <PreviewRenderer
          project={project}
          className="transition-[border-color,box-shadow] duration-300 hover:border-accent/30 hover:shadow-[0_0_30px_-8px_rgba(124,58,237,0.15)]"
        />
      </Container>

      {project.gallery.length > 0 ? (
        <Container className="pb-12">
          <div className="grid gap-4 md:grid-cols-2">
            {project.gallery.map((img, i) => (
              <div
                key={img}
                className="relative overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface aspect-[16/10]"
              >
                <Image
                  src={img}
                  alt={`${project.title} screenshot ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={i === 0}
                  priority={i === 0}
                  fetchPriority={i === 0 ? 'high' : undefined}
                />
              </div>
            ))}
          </div>
        </Container>
      ) : (
        <Container className="pb-12">
          <div className="rounded-2xl border border-border-subtle bg-bg-surface/50 p-8 text-center">
            <p className="text-sm font-medium text-text-primary">{t('galleryEmptyTitle')}</p>
            <p className="mt-1 text-sm text-text-secondary">{t('galleryEmptyDesc')}</p>
          </div>
        </Container>
      )}

      <FadeInView><Container className="pb-8">
        <div className="flex flex-wrap justify-center gap-4">
          <Button href={project.liveUrl} size="lg" trackingLabel="case_study_view_live">
            {t('ctaViewLive')}
          </Button>
          <Button href={contactHref} variant="secondary" size="lg" trackingLabel="case_study_start_similar">
            {t('ctaStartSimilar')}
          </Button>
        </div>
      </Container></FadeInView>

      <Container className="pb-32 md:pb-40">
        <div className="grid gap-16 lg:grid-cols-[1fr_2fr]">
          <FadeInView><aside className="flex flex-col gap-8">
            <div>
              <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-text-tertiary">{t('asideTimeline')}</h3>
              <p className="text-[var(--text-body)] text-text-secondary">{project.timeline}</p>
            </div>
            <div>
              <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-text-tertiary">{t('asideIndustry')}</h3>
              <p className="text-[var(--text-body)] text-text-secondary">{project.industry}</p>
            </div>
            {project.systems?.architecture && (
              <div>
                <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-text-tertiary">{t('asideArchitecture')}</h3>
                <p className="text-[var(--text-body)] leading-relaxed text-text-secondary">
                  {project.systems.architecture}
                </p>
              </div>
            )}
            {project.architecture && (
              <div>
                <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-text-tertiary">{t('asideSystemTopology')}</h3>
                <Diagram data={project.architecture} />
              </div>
            )}
            {project.constraints.length > 0 && (
              <div>
                <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-text-tertiary">{t('asideConstraints')}</h3>
                <ul className="flex flex-col gap-2">
                  {project.constraints.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-[var(--text-body)] text-text-secondary">
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {project.keyDecisions.length > 0 && (
              <div>
                <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-text-tertiary">{t('asideKeyDecisions')}</h3>
                <ul className="flex flex-col gap-4">
                  {project.keyDecisions.map((kd) => (
                    <li key={kd.decision} className="flex flex-col gap-1">
                      <p className="text-[var(--text-body)] font-medium text-text-primary">{kd.decision}</p>
                      <p className="text-sm leading-relaxed text-text-secondary">{kd.rationale || kd.tradeoff}</p>
                      {kd.outcome && (
                        <p className="text-xs text-accent">→ {kd.outcome}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.relatedServices.length > 0 && (
              <div>
                <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-accent">Related Services</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.relatedServices.map((sid) => {
                    const s = getService(sid)
                    return (
                      <span key={sid} className="rounded-full border border-border-subtle px-3 py-1 text-xs text-text-secondary">
                        {s.slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {(() => {
              const relatedCs = getCaseStudiesByProject(slug)
              if (relatedCs.length === 0) return null
              return (
                <div>
                  <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-accent">Related Case Study</h3>
                  <Link
                    href={`/case-studies/${relatedCs[0].slug}`}
                    className="mt-2 block text-sm font-medium text-text-primary underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    {relatedCs[0].title} →
                  </Link>
                </div>
              )
            })()}

            {(() => {
              const relatedDemos = SYSTEMS.filter((sys) =>
                sys.relatedServices.some((rs) => project.relatedServices.includes(rs)),
              )
              if (relatedDemos.length === 0) return null
              return (
                <div>
                  <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-accent">Related Demo</h3>
                  <Link
                    href={`/demos#${relatedDemos[0].id}`}
                    className="mt-2 block text-sm font-medium text-text-primary underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    {relatedDemos[0].name} →
                  </Link>
                </div>
              )
            })()}
          </aside></FadeInView>

          <FadeInView><div className="flex flex-col gap-12">
            <div>
              <Badge variant="accent" className="mb-4">{t('badgeProject')}</Badge>
              <p className="text-[var(--text-body)] leading-relaxed text-text-secondary">
                {project.context}
              </p>
            </div>

            <div>
              <Badge variant="accent" className="mb-4">{t('badgeChallenge')}</Badge>
              <p className="text-[var(--text-body)] leading-relaxed text-text-secondary">
                {project.businessContext.problem}
              </p>
              {project.challenges.length > 0 && (
                <ul className="mt-4 flex flex-col gap-2">
                  {project.challenges.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-[var(--text-body)] text-text-secondary">
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent-warm" />
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <Badge variant="accent" className="mb-4">{t('badgeBuilt')}</Badge>
              <ul className="flex flex-col gap-3">
                {project.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-[var(--text-body)] text-text-secondary">
                    <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Badge variant="accent" className="mb-4">{t('badgeOutcome')}</Badge>
              <p className="text-[var(--text-body)] leading-relaxed text-text-secondary">
                {project.businessContext.result} {project.outcome}
              </p>

            </div>

            {project.systems?.infrastructure && (
              <div>
                <Badge variant="accent" className="mb-4">{t('badgeInfrastructure')}</Badge>
                <h3 className="mb-4 text-[var(--text-card-title)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
                  {t('sectionDeployment')}
                </h3>
                <p className="text-[var(--text-body)] leading-relaxed text-text-secondary">
                  {project.systems.infrastructure}
                </p>
              </div>
            )}

            <div>
              <Badge variant="accent" className="mb-4">{t('badgeStack')}</Badge>
              <h3 className="mb-4 text-[var(--text-card-title)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
                {t('sectionBuiltWith')}
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-xl border border-border-subtle bg-surface-hover px-4 py-2 text-[var(--text-body)] text-text-secondary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <Badge variant="accent" className="mb-4">{t('badgeMetrics')}</Badge>
              <h3 className="mb-4 text-[var(--text-card-title)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
                {t('sectionPerformance')}
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { label: t('metricLabelLighthouse'), value: `${project.metrics.lighthouse}+` },
                  { label: t('metricLabelLoadTime'), value: project.metrics.performance },
                  { label: t('metricLabelSEO'), value: project.metrics.seo },
                  { label: t('metricLabelResponsive'), value: t('metricValueYes') },
                ].map((m, i) => (
                  <FadeInView key={m.label} delay={i * 0.05}>
                    <Card className="p-4">
                      <p className="text-[var(--text-meta)] text-text-tertiary">{m.label}</p>
                      <p className="mt-1 text-[var(--text-card-title)] font-[var(--weight-medium)] text-text-primary">{m.value}</p>
                    </Card>
                  </FadeInView>
                ))}
              </div>
              {project.performance && (
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
                  {project.performance.lcp && (
                    <Card className="p-3">
                      <p className="text-xs text-text-tertiary">{t('metricLCP')}</p>
                      <p className="mt-0.5 text-sm font-medium text-text-primary">{project.performance.lcp}</p>
                    </Card>
                  )}
                  {project.performance.cls && (
                    <Card className="p-3">
                      <p className="text-xs text-text-tertiary">{t('metricCLS')}</p>
                      <p className="mt-0.5 text-sm font-medium text-text-primary">{project.performance.cls}</p>
                    </Card>
                  )}
                  {project.performance.inp && (
                    <Card className="p-3">
                      <p className="text-xs text-text-tertiary">{t('metricINP')}</p>
                      <p className="mt-0.5 text-sm font-medium text-text-primary">{project.performance.inp}</p>
                    </Card>
                  )}
                  {project.performance.bundleSize && (
                    <Card className="p-3">
                      <p className="text-xs text-text-tertiary">{t('metricBundle')}</p>
                      <p className="mt-0.5 text-sm font-medium text-text-primary">{project.performance.bundleSize}</p>
                    </Card>
                  )}
                  {project.performance.ttfb && (
                    <Card className="p-3">
                      <p className="text-xs text-text-tertiary">{t('metricTTFB')}</p>
                      <p className="mt-0.5 text-sm font-medium text-text-primary">{project.performance.ttfb}</p>
                    </Card>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-6 border-t border-border-subtle pt-12 text-center">
              <p className="text-[var(--text-body)] text-text-secondary">
                {t('ctaSimilarInterest')}
              </p>
              <Button href={contactHref} variant="primary" size="lg" trackingLabel="case_study_final_cta">
                {t('ctaStartProject')}
              </Button>
            </div>

            {(() => {
              const related = getRelatedProjects(slug, 2)
              if (!related.length) return null
              return (
                <div className="flex flex-col gap-6 border-t border-border-subtle pt-12">
                  <p className="text-[var(--text-meta)] font-medium uppercase tracking-[var(--tracking-wider)] text-text-tertiary">
                    {t('metaRelatedProjects')}
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {related.map((r, i) => (
                      <FadeInView key={r.slug} delay={i * 0.1}><Link href={`/projects/${r.slug}`}>
                        <Card className="p-5">
                          <p className="text-[var(--text-meta)] uppercase tracking-[0.2em] text-text-tertiary">{r.industry}</p>
                          <h3 className="mt-2 text-[var(--text-card-title)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
                            {r.title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-text-secondary line-clamp-2">{r.summary}</p>
                        </Card>
                      </Link></FadeInView>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div></FadeInView>
        </div>
      </Container>
    </>
  )
}

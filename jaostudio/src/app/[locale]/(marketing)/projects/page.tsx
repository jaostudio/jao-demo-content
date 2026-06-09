import { Container } from '@/components/ui/container'
import { Badge } from '@/components/typography/badge'
import { Card } from '@/components/ui/card'
import { LayeredFrame } from '@/components/ui/layout/layered-frame'
import { ProjectTierBadge } from '@/components/projects/project-tier-badge'
import { ProjectCardLink } from '@/components/projects/project-card-link'
import { projects } from '@/lib/projects'
import { getTranslations } from 'next-intl/server'
import { ORG_ID, WEBSITE_ID } from '@/lib/json-ld-ids'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects — JAOstudio',
  description:
    'A selection of recent projects — business websites, web applications, dashboards, and e-commerce storefronts built for real clients.',
  alternates: { canonical: 'https://jaostudio.dev/projects' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${ORG_ID}/#collectionpage`,
      url: 'https://jaostudio.dev/projects',
      name: 'Projects — JAOstudio',
      isPartOf: { '@id': WEBSITE_ID },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaostudio.dev' },
        { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://jaostudio.dev/projects' },
      ],
    },
  ],
}

export default async function ProjectsPage() {
  const t = await getTranslations('projects')
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative pt-20 lg:pt-28">
        <LayeredFrame glow>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <Badge variant="accent">{t('badge')}</Badge>
            <h1 className="text-[var(--text-hero)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
              {t('pageHeading')}
            </h1>
            <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
              {t('pageDescription')}
            </p>
          </div>
        </LayeredFrame>
      </section>

      <Container className="pb-32 md:pb-40">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects
            .filter((p) => p.projectTier !== 'concept')
            .map((project) => (
              <ProjectCardLink key={project.slug} slug={project.slug}>
                <Card className="grid h-full grid-rows-[auto_1fr_auto] gap-4 max-sm:min-h-[320px]">
                  <div className="flex items-center gap-2">
                    <Badge>{project.industry}</Badge>
                    <ProjectTierBadge tier={project.projectTier} />
                  </div>

                  <div className="row-start-2 flex flex-col gap-2">
                    <h3 className="text-[var(--text-card-title)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
                      {project.title}
                    </h3>
                    {project.systems?.architecture && (
                      <p className="text-[var(--text-body)] leading-relaxed text-text-secondary line-clamp-2">
                        {project.systems.architecture}
                      </p>
                    )}

                    <p className="text-sm text-text-tertiary line-clamp-2 min-h-[96px]">
                      {project.summary}
                    </p>
                  </div>

                  <div className="row-end-3 flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                      {project.stack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-border-subtle bg-surface-hover px-2 py-0.5 text-xs text-text-tertiary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex max-sm:flex-wrap items-center gap-4 text-[var(--text-meta)] text-text-tertiary">
                      <span>{project.metrics.lighthouse}+ Lighthouse</span>
                      <span>{project.metrics.performance}</span>
                    </div>
                  </div>
                </Card>
              </ProjectCardLink>
            ))}
        </div>
      </Container>
    </>
  )
}

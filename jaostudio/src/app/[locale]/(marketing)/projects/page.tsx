import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Badge } from '@/components/typography/badge'
import { Card } from '@/components/ui/card'
import { ProjectTierBadge } from '@/components/projects/project-tier-badge'
import { ProjectCardLink } from '@/components/projects/project-card-link'
import { projects } from '@/lib/projects'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects — JAOstudio',
  description:
    'A selection of recent projects — business websites, web applications, dashboards, and e-commerce storefronts built for real clients.',
  alternates: { canonical: 'https://jaostudio.dev/projects' },
}

export default async function ProjectsPage() {
  const t = await getTranslations('projects')
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <div className="flex flex-col gap-4">
          <Badge variant="accent">{t('badge')}</Badge>
          <h1 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
            {t('pageHeading')}
          </h1>
          <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
            {t('pageDescription')}
          </p>
        </div>
      </Section>

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
                          className="rounded-md border border-border-subtle bg-surface-hover px-2 py-0.5 text-[10px] text-text-tertiary"
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

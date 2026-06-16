import { Container } from '@/components/ui/container'
import { Badge } from '@/components/typography/badge'
import { LayeredFrame } from '@/components/ui/layout/layered-frame'
import { ProjectsGrid } from '@/components/projects/projects-grid'
import { projects } from '@/lib/projects'
import { getTranslations } from 'next-intl/server'
import { ORG_ID, WEBSITE_ID } from '@/lib/json-ld-ids'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects | JAOstudio',
  description:
    'A selection of recent projects - business websites, web applications, dashboards, and e-commerce storefronts built for real clients.',
  alternates: { canonical: 'https://jaostudio.dev/projects' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${ORG_ID}/#collectionpage`,
      url: 'https://jaostudio.dev/projects',
      name: 'Projects | JAOstudio',
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
        <h2 className="sr-only">{t('pageHeading')}</h2>
        <ProjectsGrid
          projects={projects.filter((p) => p.projectTier !== 'concept')}
        />
      </Container>
    </>
  )
}

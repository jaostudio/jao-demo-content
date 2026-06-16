import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { Badge } from '@/components/typography/badge'
import { Button } from '@/components/ui/button'
import { LayeredFrame } from '@/components/ui/layout/layered-frame'
import { getTranslations } from 'next-intl/server'
import { projects } from '@/lib/projects'
import { cvProjectSlugs } from '@/lib/cv-config'
import { PERSON_ID, WEBSITE_ID } from '@/lib/json-ld-ids'

export async function generateMetadata() {
  const t = await getTranslations('cv')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: 'https://jaostudio.dev/cv' },
  }
}

const highlights = cvProjectSlugs
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter(Boolean)

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfilePage',
      '@id': `${PERSON_ID}/#profilepage`,
      url: 'https://jaostudio.dev/cv',
      name: 'CV | JAOstudio',
      isPartOf: { '@id': WEBSITE_ID },
      mainEntity: { '@id': PERSON_ID },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaostudio.dev' },
        { '@type': 'ListItem', position: 2, name: 'CV', item: 'https://jaostudio.dev/cv' },
      ],
    },
  ],
}

export default async function CVPage() {
  const t = await getTranslations('cv')

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative pt-20 lg:pt-28">
        <LayeredFrame glow>
          <div className="flex flex-col gap-4">
            <Badge variant="accent">{t('badge')}</Badge>
            <h1 className="text-[var(--text-hero)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
              {t('name')}
            </h1>
            <p className="text-[var(--text-body)] text-text-secondary">{t('role')}</p>
            <div className="flex flex-wrap gap-4 text-[var(--text-meta)] text-text-tertiary">
              <span>{t('location')}</span>
              <span>·</span>
              <span>{t('employment')}</span>
            </div>
          </div>
        </LayeredFrame>
      </section>

      <Container className="pb-32 md:pb-40">
        <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-10">
            <section>
              <h2 className="mb-4 text-[var(--text-meta)] font-medium uppercase tracking-[var(--tracking-wider)] text-text-secondary">
                {t('technicalExpertise')}
              </h2>
              <div className="flex flex-col gap-6">
                {[
                  {
                    category: t('frontend'),
                    skills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
                  },
                  {
                    category: t('infrastructure'),
                    skills: ['Vercel', 'PostgreSQL', 'REST APIs', 'Git'],
                  },
                  {
                    category: t('professional'),
                    skills: ['UI Engineering', 'Responsive Design', 'SEO', 'Performance Optimization'],
                  },
                ].map((group) => (
                  <div key={group.category}>
                    <p className="mb-2 text-[var(--text-body)] font-medium text-text-primary">{group.category}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((s) => (
                        <span
                          key={s}
                          className="rounded-md bg-bg-elevated px-2 py-1 text-[var(--text-meta)] text-text-secondary"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-10">
            <section>
              <h2 className="mb-4 text-[var(--text-meta)] font-medium uppercase tracking-[var(--tracking-wider)] text-text-secondary">
                  {t('professionalSummary')}
              </h2>
              <div className="flex flex-col gap-4 text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
                <p>{t('summary1')}</p>
                <p>{t('summary2')}</p>
                <p>{t('summary3')}</p>
              </div>
            </section>

            <section>
                <h2 className="mb-4 text-[var(--text-meta)] font-medium uppercase tracking-[var(--tracking-wider)] text-text-secondary">
                  {t('projectHighlights')}
                </h2>
              <div className="flex flex-col gap-6">
                {highlights.map((project) => project && (
                  <Link
                    key={project.slug}
                    href={`/projects/${project.slug}`}
                    className="border-l-2 border-border-active pl-4 transition-colors hover:border-accent"
                  >
                    <h3 className="text-[var(--text-body)] font-medium text-text-primary">{project.title}</h3>
                    <p className="mt-1 text-[var(--text-meta)] leading-relaxed text-text-secondary">{project.summary}</p>
                    <p className="mt-1 text-[var(--text-meta)] text-text-tertiary">{project.stack.join(' · ')}</p>
                  </Link>
                ))}
              </div>
            </section>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button href="/projects">{t('viewProjects')}</Button>
              <Button href="/#contact" variant="secondary">
                {t('startProject')}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

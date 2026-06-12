import { Badge } from '@/components/typography/badge'
import { LayeredFrame } from '@/components/ui/layout/layered-frame'
import { Container } from '@/components/ui/container'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getTranslations } from 'next-intl/server'
import { ORG_ID, WEBSITE_ID } from '@/lib/json-ld-ids'

const LIVE_TOOLS = [
  {
    id: 'liveviewer',
    url: 'https://jao-liveviewer.vercel.app',
  },
] as const

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${ORG_ID}/#live-projects`,
      url: 'https://jaostudio.dev/live-projects',
      name: 'Live Projects — JAOstudio',
      isPartOf: { '@id': WEBSITE_ID },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaostudio.dev' },
        { '@type': 'ListItem', position: 2, name: 'Live Projects', item: 'https://jaostudio.dev/live-projects' },
      ],
    },
  ],
}

export async function generateMetadata() {
  const t = await getTranslations('liveProjects')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: 'https://jaostudio.dev/live-projects' },
  }
}

export default async function LiveProjectsPage() {
  const t = await getTranslations('liveProjects')

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative pt-20 lg:pt-28">
        <LayeredFrame glow>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <Badge variant="accent">{t('badge')}</Badge>
            <h1 className="text-[var(--text-hero)] font-[var(--weight-medium)] leading-[var(--leading-display)] tracking-[var(--tracking-tight)] text-text-primary">
              {t('heading')}
            </h1>
            <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
              {t('description')}
            </p>
          </div>
        </LayeredFrame>
      </section>

      <Container className="pb-32 md:pb-40">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {LIVE_TOOLS.map((tool) => (
            <Card key={tool.id} className="flex flex-col gap-4 p-6">
              <h2 className="text-[var(--text-card-title)] font-[var(--weight-medium)] text-text-primary">
                {t(`${tool.id}.title`)}
              </h2>
              <p className="text-base leading-relaxed text-text-secondary">
                {t(`${tool.id}.description`)}
              </p>
              <div className="mt-auto">
                <Button href={tool.url} variant="primary" size="sm" trackingLabel={`live_tool_${tool.id}`}>
                  {t(`${tool.id}.cta`)}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </>
  )
}

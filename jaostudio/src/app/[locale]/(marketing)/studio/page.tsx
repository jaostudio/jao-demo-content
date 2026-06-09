import { StudioContent } from '@/components/sections/studio-content'
import { getTranslations } from 'next-intl/server'
import { ORG_ID, WEBSITE_ID } from '@/lib/json-ld-ids'

export async function generateMetadata() {
  const t = await getTranslations('studio')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: 'https://jaostudio.dev/studio' },
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': `${ORG_ID}/#aboutpage`,
      url: 'https://jaostudio.dev/studio',
      name: 'Studio — JAOstudio',
      isPartOf: { '@id': WEBSITE_ID },
      mainEntity: { '@id': ORG_ID },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaostudio.dev' },
        { '@type': 'ListItem', position: 2, name: 'Studio', item: 'https://jaostudio.dev/studio' },
      ],
    },
  ],
}

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <StudioContent />
    </>
  )
}

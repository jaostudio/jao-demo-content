import { getTranslations } from 'next-intl/server'
import { SystemProvider } from '@/components/layout/system-provider'
import { Hero } from '@/components/sections/hero/hero'
import { BelowFold } from '@/components/layout/below-fold'
import { ORG_ID, WEBSITE_ID } from '@/lib/json-ld-ids'

export async function generateMetadata() {
  const t = await getTranslations('hero')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: 'https://jaostudio.dev' },
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${ORG_ID}/#webpage`,
      url: 'https://jaostudio.dev',
      name: 'JAOstudio | Custom Websites & Web Applications',
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': ORG_ID },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaostudio.dev' },
      ],
    },
  ],
}

export default function Home() {
  return (
    <SystemProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <BelowFold />
    </SystemProvider>
  )
}

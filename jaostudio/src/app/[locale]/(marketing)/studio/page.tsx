import { StudioContent } from '@/components/sections/studio-content'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('studio')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: 'https://jaostudio.dev/studio' },
  }
}

export default function AboutPage() {
  return <StudioContent />
}

import { getTranslations } from 'next-intl/server'
import { SystemProvider } from '@/components/layout/system-provider'
import { Hero } from '@/components/sections/hero/hero'
import { BelowFold } from '@/components/layout/below-fold'

export async function generateMetadata() {
  const t = await getTranslations('hero')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: 'https://jaostudio.dev' },
  }
}

export default function Home() {
  return (
    <SystemProvider>
      <Hero />
      <BelowFold />
    </SystemProvider>
  )
}

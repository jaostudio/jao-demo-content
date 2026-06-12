import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('notFound')
  return { title: t('metaTitle') }
}

export default async function NotFound() {
  const t = await getTranslations('notFound')

  return (
    <Container className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center gap-6">
        <span className="text-[64px] font-[var(--weight-medium)] leading-none text-accent">404</span>
        <h1 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
          {t('heading')}
        </h1>
        <p className="max-w-md text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
          {t('description')}
        </p>
        <div className="flex flex-wrap gap-4">
          <Button href="/">{t('home')}</Button>
          <Button href="/projects" variant="secondary">
            {t('projects')}
          </Button>
          <Button href="/#contact" variant="secondary">
            {t('contact')}
          </Button>
        </div>
      </div>
    </Container>
  )
}

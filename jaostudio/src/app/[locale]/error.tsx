'use client'

import { useTranslations } from 'next-intl'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('errorPage')

  return (
    <Container className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center gap-6">
        <span className="text-[64px] font-[var(--weight-medium)] leading-none text-accent-warm">!</span>
        <h1 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
          {t('heading')}
        </h1>
        <p className="max-w-md text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
          {t('description')}
        </p>
        <div className="flex flex-wrap gap-4">
          <Button onClick={reset}>{t('retry')}</Button>
          <Button href="/" variant="secondary">
            {t('home')}
          </Button>
        </div>
      </div>
    </Container>
  )
}

'use client'

import NextLink from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { Container } from '@/components/ui/container'

export function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()
  const contactHref = locale === 'en' ? '/#contact' : '/tl/#contact'

  return (
    <footer className="border-t border-border-subtle">
      <Container className="flex flex-col items-center justify-between gap-6 py-12 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <NextLink href="/" className="text-base font-medium text-text-primary">
            {t('brand')}
          </NextLink>
          <p className="text-sm text-text-tertiary">
            {t('tagline')}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <NextLink
            href={contactHref}
            className="focus-ring text-sm leading-relaxed text-text-secondary transition-colors hover:text-text-primary"
          >
            {t('contact')}
          </NextLink>
          <a
            href="https://github.com/jaoce"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring text-sm leading-relaxed text-text-secondary transition-colors hover:text-text-primary"
            aria-label={`JAOstudio ${t('github')}`}
          >
            {t('github')}
          </a>
          <a
            href="https://linkedin.com/in/jamesonolitoquit"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring text-sm leading-relaxed text-text-secondary transition-colors hover:text-text-primary"
            aria-label={`Jameson Olitoquit ${t('linkedin')}`}
          >
            {t('linkedin')}
          </a>
        </div>

        <p className="text-sm leading-relaxed text-text-tertiary">
          {t('credit')}
        </p>

        <div className="flex flex-col items-center gap-1 md:items-end">
          <p className="text-xs text-text-tertiary/60">
            Updated June 2026
          </p>
          <a
            href="https://github.com/jaoce/jaostudio/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text-tertiary/60 transition-colors hover:text-text-secondary"
          >
            Report an issue
          </a>
        </div>
      </Container>
    </footer>
  )
}

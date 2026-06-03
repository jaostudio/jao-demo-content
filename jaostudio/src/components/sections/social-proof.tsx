'use client'

import { useTranslations } from 'next-intl'
import { Container } from '@/components/ui/container'

export function SocialProof() {
  const t = useTranslations('socialProof')
  const items = [t('item1'), t('item2'), t('item3'), t('item4'), t('item5'), t('item6')]

  return (
    <div className="border-y border-border-subtle">
      <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5 md:gap-x-12">
        {items.map((item) => (
          <span
            key={item}
            className="text-[var(--text-meta)] font-[var(--weight-medium)] text-text-tertiary"
          >
            {item}
          </span>
        ))}
      </Container>
    </div>
  )
}

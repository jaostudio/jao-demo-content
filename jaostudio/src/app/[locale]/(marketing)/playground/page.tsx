'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/ui/container'
import { Badge } from '@/components/typography/badge'
import { Card } from '@/components/ui/card'
import { LayeredFrame } from '@/components/ui/layout/layered-frame'
import { track, EVENTS } from '@/lib/analytics'
import { easeOut } from '@/lib/motion-variants'
import { useTranslations } from 'next-intl'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      url: 'https://jaostudio.dev/playground',
      name: 'Playground — JAOstudio',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaostudio.dev' },
        { '@type': 'ListItem', position: 2, name: 'Playground', item: 'https://jaostudio.dev/playground' },
      ],
    },
  ],
}

export default function PlaygroundPage() {
  const t = useTranslations('playground')

  const demos = [
    { title: t('demo1Title'), description: t('demo1Description'), category: t('demo1Category') },
    { title: t('demo2Title'), description: t('demo2Description'), category: t('demo2Category') },
    { title: t('demo3Title'), description: t('demo3Description'), category: t('demo3Category') },
    { title: t('demo4Title'), description: t('demo4Description'), category: t('demo4Category') },
    { title: t('demo5Title'), description: t('demo5Description'), category: t('demo5Category') },
    { title: t('demo6Title'), description: t('demo6Description'), category: t('demo6Category') },
    { title: t('demo7Title'), description: t('demo7Description'), category: t('demo7Category') },
    { title: t('demo8Title'), description: t('demo8Description'), category: t('demo8Category') },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative pt-20 lg:pt-28">
        <LayeredFrame glow>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <Badge variant="accent">{t('badge')}</Badge>
            <h1 className="text-[var(--text-hero)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
              {t('heading')}
            </h1>
            <p className="max-w-lg text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
              {t('description')}
            </p>
          </div>
        </LayeredFrame>
      </section>

      <Container className="pb-32 md:pb-40">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {demos.map((demo, i) => (
            <motion.div
              key={demo.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: easeOut }}
            >
              <Card
                className="flex h-full cursor-pointer flex-col gap-4 p-6"
                onClick={() => track(EVENTS.PLAYGROUND_CARD_CLICK, { demo: demo.title, category: demo.category })}
              >
                <Badge>{demo.category}</Badge>
                <h3 className="text-[var(--text-card-title)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
                  {demo.title}
                </h3>
                <p className="text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">{demo.description}</p>
                <div className="mt-auto flex h-32 items-center justify-center rounded-xl border border-border-subtle bg-bg-elevated">
                  <p className="text-[var(--text-meta)] text-text-tertiary">{t('demoComingSoon')}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </>
  )
}

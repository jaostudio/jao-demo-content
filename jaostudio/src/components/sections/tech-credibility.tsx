'use client'

import { useTranslations } from 'next-intl'
import { motion, useReducedMotion } from 'framer-motion'
import { Section } from '@/components/ui/section'
import { Badge } from '@/components/typography/badge'
import { Card } from '@/components/ui/card'
import { fadeUp, fadeUpReduced, scaleFade, slideInLeft, slideInReduced, stagger } from '@/lib/motion-variants'

const metrics = [
  { value: '102 kB', label: 'Shared JS Bundle' },
  { value: '22', label: 'Static Routes' },
  { value: '95+', label: 'Lighthouse Score' },
  { value: '<2s', label: 'Vercel Deploy' },
]

export function TechCredibility() {
  const t = useTranslations('tech')
  const prefersReducedMotion = useReducedMotion()
  return (
    <Section variant="alt" id="approach" glow className="">
      <div className="grid gap-16 lg:grid-cols-2">
        <motion.div
          className="flex flex-col gap-8"
          variants={prefersReducedMotion ? fadeUpReduced : fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <Badge variant="accent">{t('badge')}</Badge>
          <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
            {t('heading')}
          </h2>
          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={prefersReducedMotion ? stagger(0.01) : stagger()}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {metrics.map((m) => (
              <motion.div key={m.label} variants={prefersReducedMotion ? fadeUpReduced : scaleFade}>
                <Card className="border-t border-t-accent-warm/30 p-4 md:p-6" hover={false}>
                  <p className="text-[var(--text-section)] font-[var(--weight-medium)] text-text-primary">{m.value}</p>
                  <p className="mt-1 text-[var(--text-meta)] text-text-tertiary">{m.label}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="flex flex-col justify-center gap-6"
          variants={prefersReducedMotion ? fadeUpReduced : fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.1 }}
        >
          <Badge className="mb-4">{t('badge2')}</Badge>
          <h3 className="text-[var(--text-card-title)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
            {t('heading2')}
          </h3>
          <p className="text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
            {t('description')}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-[var(--text-meta)] text-text-secondary">
            <span className="rounded-md bg-accent/10 px-2.5 py-1 text-accent">{t('pipeline1')}</span>
            <span className="text-text-tertiary">→</span>
            <span className="rounded-md bg-accent/10 px-2.5 py-1 text-accent">{t('pipeline2')}</span>
            <span className="text-text-tertiary">→</span>
            <span className="rounded-md bg-accent/10 px-2.5 py-1 text-accent">{t('pipeline3')}</span>
            <span className="text-text-tertiary">→</span>
            <span className="rounded-md bg-accent/10 px-2.5 py-1 text-accent">{t('pipeline4')}</span>
            <span className="text-text-tertiary">→</span>
            <span className="rounded-md bg-accent/10 px-2.5 py-1 text-accent">{t('pipeline5')}</span>
          </div>
          <p className="text-xs text-text-tertiary mt-1">{t('timeline')}</p>
          <motion.ul
            className="flex flex-col gap-3"
            variants={prefersReducedMotion ? stagger(0.01) : stagger(0.06)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {[
              t('bullet1'),
              t('bullet2'),
              t('bullet3'),
              t('bullet4'),
              t('bullet5'),
              t('bullet6'),
            ].map((item) => (
              <motion.li
                key={item}
                variants={prefersReducedMotion ? slideInReduced : slideInLeft}
                className="flex items-start gap-3 text-[var(--text-body)] text-text-secondary"
              >
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent" />
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </Section>
  )
}

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/typography/badge'
import { Section } from '@/components/ui/section'
import { stagger, fadeUp, fadeUpReduced } from '@/lib/motion-variants'

export function DeliveryStages() {
  const t = useTranslations('services')
  const prefersReducedMotion = useReducedMotion() ?? false

  const stages = [1, 2, 3, 4, 5] as const
  const delay = prefersReducedMotion ? 0 : 0.12
  const cardAnim = prefersReducedMotion ? fadeUpReduced : fadeUp

  return (
    <Section density="compact" id="delivery-stages">
      <div className="flex flex-col items-center text-center">
        <Badge variant="accent">{t('processBadge')}</Badge>
        <h2 className="mt-2 text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
          {t('deliveryStages')}
        </h2>
      </div>
      <motion.div
        className="mt-8 flex flex-col gap-4 xl:flex-row xl:items-stretch xl:gap-4"
        variants={stagger(delay)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {stages.map((i, index) => (
          <motion.div
            key={i}
            className="flex flex-1 flex-col"
            variants={cardAnim}
          >
            <Card className="flex min-h-[280px] flex-col p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-white">
                  {i}
                </span>
                <p className="text-sm font-medium text-text-primary">{t(`stage${i}Title`)}</p>
              </div>
              <div className="mt-3 border-t border-border-subtle" />
              <div className="mt-3 flex flex-1 flex-col justify-center gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-text-tertiary">
                    {t('timeline')}
                  </p>
                  <p className="mt-0.5 text-xs text-text-tertiary">{t(`stage${i}Timeline`)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-text-secondary">{t('output')}</p>
                  <p className="mt-0.5 text-xs text-text-tertiary">{t(`stage${i}Output`)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-text-secondary">{t('fromYou')}</p>
                  <p className="mt-0.5 text-xs text-text-tertiary">{t(`stage${i}Input`)}</p>
                </div>
              </div>
            </Card>
            {index < stages.length - 1 && (
              <motion.div
                className="flex justify-center py-2 xl:py-0 xl:self-center xl:px-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.1, duration: 0.3 }}
              >
                <ChevronDown className="h-5 w-5 shrink-0 text-text-tertiary/40 xl:hidden" />
                <ChevronRight className="hidden h-5 w-5 shrink-0 text-text-tertiary/40 xl:block" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}

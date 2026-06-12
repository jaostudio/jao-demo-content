'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/typography/badge'
import { Section } from '@/components/ui/section'
import { stagger, fadeUp, fadeUpReduced } from '@/lib/motion-variants'

const CAROUSEL_SPEED = 50

export function DeliveryStages() {
  const t = useTranslations('services')
  const prefersReducedMotion = useReducedMotion() ?? false

  const stages = [1, 2, 3, 4, 5] as const
  const delay = prefersReducedMotion ? 0 : 0.12
  const cardAnim = prefersReducedMotion ? fadeUpReduced : fadeUp

  const x = useMotionValue(0)
  const [isPaused, setIsPaused] = useState(false)
  const [setWidth, setSetWidth] = useState(0)
  const innerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isVisibleRef = useRef(true)
  const dragTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pause = () => {
    if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current)
    setIsPaused(true)
  }

  const resumeWithDelay = () => {
    if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current)
    dragTimeoutRef.current = setTimeout(() => setIsPaused(false), 2000)
  }

  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    const measure = () => setSetWidth(el.scrollWidth / 2)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting },
      { threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (prefersReducedMotion || setWidth <= 0) return

    let rafId: number
    let lastTime = performance.now()

    function tick() {
      const now = performance.now()
      if (isPaused || !isVisibleRef.current) {
        lastTime = now
        rafId = requestAnimationFrame(tick)
        return
      }
      const dt = (now - lastTime) / 1000
      lastTime = now

      let newX = x.get() - CAROUSEL_SPEED * dt
      if (newX <= -setWidth) {
        newX = newX + setWidth
      }
      x.set(newX)

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [prefersReducedMotion, isPaused, setWidth, x])

  const doubledStages = prefersReducedMotion ? stages : [...stages, ...stages]

  return (
    <Section density="compact" id="delivery-stages">
      <div className="flex flex-col items-center text-center">
        <Badge variant="accent">{t('processBadge')}</Badge>
        <h2 className="mt-2 text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
          {t('deliveryStages')}
        </h2>
      </div>

      <div
        ref={containerRef}
        className="sm:hidden mt-6 overflow-hidden rounded-2xl border border-border-subtle bg-surface-hover"
        onMouseEnter={pause}
        onMouseLeave={resumeWithDelay}
      >
        <motion.div
          ref={innerRef}
          className="flex gap-3 p-3"
          style={{ x }}
          drag={prefersReducedMotion ? undefined : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragStart={pause}
          onDragEnd={resumeWithDelay}
        >
          {doubledStages.map((i, idx) => (
            <Card
              key={`${i}-${idx}`}
              className="flex w-[75vw] shrink-0 flex-col gap-2 p-3"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-white">
                  {i}
                </span>
                <p className="text-sm font-medium text-text-primary">{t(`stage${i}Title`)}</p>
              </div>
              <div className="border-t border-border-subtle" />
              <div className="grid grid-cols-3 gap-1.5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-text-tertiary">{t('timeline')}</p>
                  <p className="mt-0.5 text-xs text-text-tertiary">{t(`stage${i}Timeline`)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-text-secondary">{t('output')}</p>
                  <p className="mt-0.5 text-xs text-text-tertiary leading-tight">{t(`stage${i}Output`)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-text-secondary">{t('fromYou')}</p>
                  <p className="mt-0.5 text-xs text-text-tertiary leading-tight">{t(`stage${i}Input`)}</p>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="max-sm:hidden mt-8 flex flex-col gap-4 xl:flex-row xl:items-stretch xl:gap-4"
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

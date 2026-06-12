'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Section } from '@/components/ui/section'
import { Badge } from '@/components/typography/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import Link from 'next/link'
import { easeOut, durations } from '@/lib/motion-variants'
import { useActiveNode } from '@/components/layout/system-provider'
import { useMediaQuery } from '@/lib/hooks/use-media-query'
import type { ProcessAccordionStep } from './process-mobile-accordion'
import { ProcessMobileSlides } from './process-mobile-slides'

const AUTO_ADVANCE_MS = 3600

const nodeToStep: Record<string, number> = {
  orchestrator: 0,
  platform: 1,
  pipeline: 2,
  inference: 3,
  data: 4,
}

function ProcessDesktopScrollytelling({
  steps,
  stepPills,
  activeIndex,
  activeStep,
  nextTitle,
  prefersReducedMotion,
  disableAutoAdvance,
  isPaused,
  isTransitioning,
  setIsPaused,
  setIsTransitioning,
  setActiveIndex,
  setUserInteracted,
  handleKeyDown,
  announce,
  ctaLabel,
  t,
}: {
  steps: readonly ProcessAccordionStep[]
  stepPills: ReadonlyArray<{
    step: string
    title: string
    summary: string
    selected: boolean
    contextual: boolean
    onClick: () => void
  }>
  activeIndex: number
  activeStep: ProcessAccordionStep
  nextTitle: string
  prefersReducedMotion: boolean
  disableAutoAdvance: boolean
  isPaused: boolean
  isTransitioning: boolean
  setIsPaused: (v: boolean) => void
  setIsTransitioning: (v: boolean) => void
  setActiveIndex: (i: number | ((c: number) => number)) => void
  setUserInteracted: (v: boolean) => void
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void
  announce: string
  ctaLabel: string
  t: ReturnType<typeof useTranslations<'process'>>
}) {
  return (
    <div
      className="mt-8 max-md:mt-4 flex flex-col gap-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsPaused(false)
        }
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-roledescription="process stepper"
      aria-label="Project process steps. Use arrow keys to move between steps."
    >
      <motion.div
        className="hidden md:flex items-center justify-between rounded-[2rem] border border-border-subtle bg-bg-surface/75 px-4 py-2 md:px-6 md:py-3"
        {...(prefersReducedMotion
          ? {}
          : {
              initial: { opacity: 0, y: 18 },
              whileInView: { opacity: 1, y: 0 },
            })}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: prefersReducedMotion ? 0 : durations.slow, ease: easeOut }}
      >
        <div className="flex items-center gap-2">
          {stepPills.map((step, index) => (
            <button
              key={step.step}
              type="button"
              onClick={step.onClick}
              className={cn(
                'flex items-center gap-2 rounded-xl px-3 py-2 text-left transition-colors duration-300',
                step.selected
                  ? 'bg-accent/8 shadow-[0_0_0_1px_rgba(124,58,237,0.14)]'
                  : 'hover:bg-surface-hover',
              )}
            >
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-medium transition-colors',
                  step.selected
                    ? 'border-accent/30 bg-accent-soft text-text-primary'
                    : step.contextual
                      ? 'border-accent-warm/30 bg-bg-elevated text-accent-warm'
                      : 'border-border-subtle bg-bg-elevated text-text-secondary',
                )}
              >
                {step.step}
              </span>
              <span className={cn(
                'hidden lg:block text-sm',
                step.selected ? 'text-text-primary' : 'text-text-secondary',
              )}>
                {step.title}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-tertiary whitespace-nowrap">
            {activeIndex + 1}/{steps.length}
          </span>
          <span className="text-xs text-text-tertiary/40">·</span>
          <span className="text-xs uppercase tracking-[0.2em] text-text-tertiary whitespace-nowrap">
            {activeStep.title} → {nextTitle}
          </span>
        </div>
      </motion.div>

      <motion.section
        className="relative overflow-hidden rounded-[2rem] border border-border-subtle bg-bg-surface/75 p-4 md:p-6 lg:p-8"
        {...(prefersReducedMotion
          ? {}
          : {
              initial: { opacity: 0, y: 18 },
              whileInView: { opacity: 1, y: 0 },
            })}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: prefersReducedMotion ? 0 : durations.slow, delay: 0.08, ease: easeOut }}
      >
        {!prefersReducedMotion && (
          <div
            className="pointer-events-none absolute inset-0 opacity-70 max-md:hidden"
            style={{
              background:
                'radial-gradient(circle at 50% 20%, rgba(124,58,237,0.12), transparent 45%), radial-gradient(circle at 20% 20%, rgba(217,119,6,0.08), transparent 32%)',
            }}
          />
        )}
        <div className="pointer-events-none absolute inset-x-8 top-6 h-px bg-gradient-to-r from-transparent via-accent-soft to-transparent max-md:hidden" />
        <div className="pointer-events-none absolute inset-x-8 bottom-6 h-px bg-gradient-to-r from-transparent via-accent-soft to-transparent max-md:hidden" />

        <div className="relative h-full">
          <div className="sr-only" aria-live="polite">{announce}</div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeStep.step}
              className="flex h-full flex-col justify-between gap-4 md:gap-6"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 24, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -24, filter: 'blur(4px)' }}
              transition={{ duration: prefersReducedMotion ? 0 : durations.slow, ease: easeOut }}
              onAnimationStart={() => setIsTransitioning(true)}
              onAnimationComplete={() => setIsTransitioning(false)}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-text-secondary">Step {activeStep.step}</p>
                  <h3 className="mt-2 text-[var(--text-card-title)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
                    {activeStep.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
                    {activeStep.summary}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[1.1fr_auto] md:items-end">
                <div>
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-text-secondary">
                    <span>Progress</span>
                    <span>{activeIndex + 1}/{steps.length}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-hover">
                    <motion.div
                      key={activeStep.step}
                      className={cn('h-full rounded-full bg-gradient-to-r', accentForStep(activeIndex))}
                      initial={{ width: '0%' }}
                      animate={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
                      transition={{ duration: durations.slow, ease: easeOut }}
                    />
                  </div>
                </div>

                <Button
                  href="/#contact"
                  variant="primary"
                  size="md"
                  trackingLabel="process_primary_cta"
                  className="justify-self-start"
                >
                  {ctaLabel}
                </Button>
              </div>

              {/* Quality metrics */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { value: '102 kB', label: 'Shared JS (demo)' },
                  { value: '22', label: 'Routes (demo)' },
                  { value: '95+', label: 'Lighthouse (demo)' },
                  { value: '<2s', label: 'Deploy (demo)' },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="rounded-xl border border-border-subtle bg-bg-surface/80 px-3 py-3 text-center"
                  >
                    <p className="text-lg font-semibold text-text-primary">{m.value}</p>
                    <p className="mt-0.5 text-[var(--text-meta)] text-text-tertiary">{m.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>
    </div>
  )
}

function accentForStep(index: number): string {
  return index % 2 === 0 ? 'from-accent-warm/40 to-transparent' : 'from-accent/40 to-transparent'
}

export function ProcessScrollytelling() {
  const prefersReducedMotion = useReducedMotion() ?? false
  const isMobile = useMediaQuery('(max-width: 767px)')
  const reduceMotion = prefersReducedMotion
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const [announce, setAnnounce] = useState('')
  const activeNode = useActiveNode()
  const nodeStepIndex = activeNode && activeNode in nodeToStep ? nodeToStep[activeNode] : undefined
  const t = useTranslations('process')

  const steps: readonly ProcessAccordionStep[] = useMemo(
    () => [
      { step: '01', title: t('step1Name'), summary: t('step1Summary'), details: t('step1Detail'), deliverables: ['Audit', 'Brief', 'Success metrics'] },
      { step: '02', title: t('step2Name'), summary: t('step2Summary'), details: t('step2Detail'), deliverables: ['Flow map', 'Wireframes', 'Conversion plan'] },
      { step: '03', title: t('step3Name'), summary: t('step3Summary'), details: t('step3Detail'), deliverables: ['Frontend build', 'Accessibility pass', 'Responsive QA'] },
      { step: '04', title: t('step4Name'), summary: t('step4Summary'), details: t('step4Detail'), deliverables: ['Perf tuning', 'Analytics setup', 'A/B notes'] },
      { step: '05', title: t('step5Name'), summary: t('step5Summary'), details: t('step5Detail'), deliverables: ['Launch', 'Monitoring', 'Handoff'] },
    ],
    [t],
  )

  const shouldAutoAdvance = !isMobile && !reduceMotion && !userInteracted && !isPaused && !isTransitioning

  useEffect(() => {
    if (!shouldAutoAdvance) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % steps.length)
    }, AUTO_ADVANCE_MS)

    return () => window.clearInterval(interval)
  }, [shouldAutoAdvance, steps.length])

  useEffect(() => {
    setAnnounce(`${steps[activeIndex].title}: ${steps[activeIndex].summary}`)
  }, [activeIndex, steps])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (isMobile) return
    if (event.key === 'ArrowRight') {
      setIsPaused(true)
      setUserInteracted(true)
      setActiveIndex((i) => (i + 1) % steps.length)
      event.preventDefault()
    }
    if (event.key === 'ArrowLeft') {
      setIsPaused(true)
      setUserInteracted(true)
      setActiveIndex((i) => (i - 1 + steps.length) % steps.length)
      event.preventDefault()
    }
  }

  const handleSelectStep = (index: number) => {
    if (index === activeIndex) return
    setActiveIndex(index)
    setUserInteracted(true)
  }

  const activeStep = steps[activeIndex]
  const nextTitle = activeIndex < steps.length - 1 ? steps[activeIndex + 1].title : 'Complete'

  const stepPills = useMemo(
    () =>
      steps.map((step, index) => ({
        ...step,
        selected: index === activeIndex,
        contextual: nodeStepIndex !== undefined && index === nodeStepIndex,
        onClick: () => handleSelectStep(index),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [steps, activeIndex, nodeStepIndex],
  )

  const headerBlock = (
    <div className="flex flex-col gap-3 items-center text-center md:max-w-2xl mx-auto md:gap-4">
      <motion.div
        {...(prefersReducedMotion
          ? {}
          : {
              initial: { opacity: 0, y: 16 },
              whileInView: { opacity: 1, y: 0 },
            })}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: prefersReducedMotion ? 0 : durations.slow, ease: easeOut }}
      >
        <Badge variant="accent">{t('badge')}</Badge>
      </motion.div>
      <motion.h2
        className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary"
        {...(prefersReducedMotion
          ? {}
          : {
              initial: { opacity: 0, y: 16 },
              whileInView: { opacity: 1, y: 0 },
            })}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: prefersReducedMotion ? 0 : durations.slow, delay: 0.1, ease: easeOut }}
      >
        {t('heading')}
      </motion.h2>
      <motion.p
        className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary"
        {...(prefersReducedMotion
          ? {}
          : {
              initial: { opacity: 0, y: 16 },
              whileInView: { opacity: 1, y: 0 },
            })}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: prefersReducedMotion ? 0 : durations.slow, delay: 0.16, ease: easeOut }}
      >
        {t('description')}
      </motion.p>
    </div>
  )

  if (isMobile) {
    return (
      <Section
        id="process"
        className=""
        density="compact"
      >
        {headerBlock}
        <div className="mt-6">
          <ProcessMobileSlides
            steps={steps}
            startYourProjectLabel={t('cta')}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          {[
            { value: '102 kB', label: 'Shared JS (demo)' },
            { value: '22', label: 'Routes (demo)' },
            { value: '95+', label: 'Lighthouse (demo)' },
            { value: '<2s', label: 'Deploy (demo)' },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-border-subtle bg-bg-surface/80 px-3 py-2 text-center"
            >
              <p className="text-sm font-semibold text-text-primary">{m.value}</p>
              <p className="mt-0.5 text-[var(--text-meta)] text-text-tertiary">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
          >
            {t('cta')} →
          </Link>
        </div>
      </Section>
    )
  }

  return (
    <Section
      id="process"
      className=""
      density="compact"
    >
      {headerBlock}
      <ProcessDesktopScrollytelling
        steps={steps}
        stepPills={stepPills}
        activeIndex={activeIndex}
        activeStep={activeStep}
        nextTitle={nextTitle}
        prefersReducedMotion={prefersReducedMotion}
        disableAutoAdvance={prefersReducedMotion}
        isPaused={isPaused}
        isTransitioning={isTransitioning}
        setIsPaused={setIsPaused}
        setIsTransitioning={setIsTransitioning}
        setActiveIndex={setActiveIndex}
        setUserInteracted={setUserInteracted}
        handleKeyDown={handleKeyDown}
        announce={announce}
        ctaLabel={t('cta')}
        t={t}
      />
    </Section>
  )
}

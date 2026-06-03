'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Section } from '@/components/ui/section'
import { Badge } from '@/components/typography/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { easeOut, durations } from '@/lib/motion-variants'
import { useActiveNode } from '@/components/layout/system-provider'
import { useMediaQuery } from '@/lib/hooks/use-media-query'
import { track, EVENTS } from '@/lib/analytics'
import { ProcessMobileAccordion, type ProcessAccordionStep } from './process-mobile-accordion'

const AUTO_ADVANCE_MS = 3600

const nodeToStep: Record<string, number> = {
  orchestrator: 0,
  platform: 1,
  pipeline: 2,
  inference: 3,
  data: 4,
}

function ProcessPreviewButton({
  step,
  title,
  summary,
  selected,
  contextual,
  onClick,
}: {
  step: string
  title: string
  summary: string
  selected?: boolean
  contextual?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-300',
        selected
          ? 'border-accent/30 bg-accent/8 shadow-[0_0_0_1px_rgba(124,58,237,0.14)]'
          : contextual
            ? 'border-accent-warm/20 bg-accent-warm-soft/5 hover:border-border-active hover:bg-bg-surface/70'
            : 'border-border-subtle bg-bg/55 hover:border-border-active hover:bg-bg-surface/70',
      )}
    >
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-[10px] font-medium transition-colors',
          selected
            ? 'border-accent/30 bg-accent-soft text-text-primary'
            : contextual
              ? 'border-accent-warm/20 bg-accent-warm-soft/10 text-accent-warm'
              : 'border-border-subtle bg-bg-elevated text-text-secondary',
        )}
      >
        {step}
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn('block text-[var(--text-body)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)]', selected ? 'text-text-primary' : 'text-text-secondary')}>
          {title}
        </span>
        <span className="mt-1 block text-[var(--text-meta)] leading-relaxed text-text-secondary">{summary}</span>
      </span>
    </button>
  )
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
      className="mt-8 max-md:mt-4 grid md:min-h-[clamp(28rem,55svh,36rem)] gap-4 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch"
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
      <motion.aside
        className="hidden md:flex h-full flex-col justify-between rounded-[2rem] border border-border-subtle bg-bg-surface/75 p-3 md:p-5"
        {...(prefersReducedMotion
          ? {}
          : {
              initial: { opacity: 0, y: 18 },
              whileInView: { opacity: 1, y: 0 },
            })}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: prefersReducedMotion ? 0 : durations.slow, ease: easeOut }}
      >
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center gap-3 max-sm:hidden">
            <div className="h-px flex-1 bg-gradient-to-r from-accent-warm/60 via-accent/35 to-transparent" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-text-secondary">Process map</span>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {stepPills.map((step) => (
              <ProcessPreviewButton
                key={step.step}
                step={step.step}
                title={step.title}
                summary={step.summary}
                selected={step.selected}
                contextual={step.contextual}
                onClick={step.onClick}
              />
            ))}
          </div>
        </div>

        <div className="mt-3 md:mt-5 border-t border-border-subtle pt-3 md:pt-4">
          <span className="text-xs text-text-tertiary">
            {disableAutoAdvance ? 'Tap a step to explore' : 'Auto-advances every 3.6 seconds'}
          </span>
        </div>
      </motion.aside>

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
                  <p className="text-[10px] uppercase tracking-[0.28em] text-text-secondary">Step {activeStep.step}</p>
                  <h3 className="mt-2 text-[var(--text-card-title)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
                    {activeStep.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
                    {activeStep.summary}
                  </p>
                </div>
                <div className="hidden shrink-0 md:flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-surface/60 px-3 py-1.5">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary whitespace-nowrap">
                    {activeIndex + 1}/{steps.length}
                  </span>
                  <span className="text-[10px] text-text-tertiary/60">·</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary whitespace-nowrap">
                    {activeStep.title} → {nextTitle}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="rounded-xl bg-surface-hover p-4 md:p-5">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-text-secondary">What happens here</p>
                  <p className="mt-3 text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
                    {activeStep.details}
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                  {activeStep.deliverables.map((deliverable) => (
                    <span
                      key={deliverable}
                      className="rounded-2xl border border-border-subtle bg-bg-surface/85 px-3 py-2 text-center text-[10px] uppercase tracking-[0.22em] text-text-secondary"
                    >
                      {deliverable}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[1.1fr_auto] md:items-end">
                <div>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-text-secondary">
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

  const handleMobileOpenChange = (index: number) => {
    setActiveIndex(index)
    setUserInteracted(true)
    track(EVENTS.PROCESS_STEP_OPENED, {
      step: index + 1,
      title: steps[index].title,
      viewport: 'mobile',
    })
  }

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
          <ProcessMobileAccordion
            steps={steps}
            openIndex={activeIndex}
            onOpenChange={handleMobileOpenChange}
            ctaLabel={t('cta')}
            ctaHref="/#contact"
          />
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

'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'
import Link from 'next/link'
import type { ProcessAccordionStep } from './process-mobile-accordion'

interface ProcessMobileSlidesProps {
  steps: readonly ProcessAccordionStep[]
  startYourProjectLabel: string
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 200 : -200, opacity: 0 }),
}

export function ProcessMobileSlides({ steps, startYourProjectLabel }: ProcessMobileSlidesProps) {
  const prefersReduced = useReducedMotion()
  const [[current, direction], setPage] = useState([0, 0])

  function paginate(newDirection: number) {
    const next = current + newDirection
    if (next < 0 || next >= steps.length) return
    setPage([next, newDirection])
  }

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x > 50) paginate(-1)
    else if (info.offset.x < -50) paginate(1)
  }

  const step = steps[current]

  return (
    <div className="overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface">
      <div className="px-4 py-5">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={prefersReduced ? undefined : slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeOut' }}
            drag={prefersReduced ? undefined : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            className="select-none"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-accent/30 bg-accent-soft text-xs font-medium text-text-primary">
                {step.step}
              </span>
              <p className="font-medium text-text-primary">{step.title}</p>
            </div>
            <p className="text-base leading-relaxed text-text-secondary">
              {step.summary}
            </p>
            <p className="mt-3 text-[var(--text-meta)] leading-relaxed text-text-secondary/80">
              {step.details}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between border-t border-border-subtle px-4 py-3">
        <div className="flex items-center gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage([i, i > current ? 1 : -1])}
              aria-label={`Go to step ${i + 1}`}
              className="flex items-center justify-center min-w-[24px] min-h-[24px]"
            >
              <span className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === current ? 'w-6 bg-accent' : 'w-1.5 bg-border-subtle',
              )} />
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => paginate(-1)}
            disabled={current === 0}
            aria-label="Previous step"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-subtle text-text-secondary transition-colors hover:bg-surface-hover disabled:opacity-30"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => paginate(1)}
            disabled={current === steps.length - 1}
            aria-label="Next step"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-subtle text-text-secondary transition-colors hover:bg-surface-hover disabled:opacity-30"
          >
            →
          </button>
        </div>
      </div>

      {current === steps.length - 1 && (
        <div className="border-t border-border-subtle px-4 py-3">
          <Link
            href="/#contact"
            className="flex w-full items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
          >
            {startYourProjectLabel} →
          </Link>
        </div>
      )}
    </div>
  )
}

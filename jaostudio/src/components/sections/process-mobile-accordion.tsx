'use client'

import { useId } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'

export interface ProcessAccordionStep {
  step: string
  title: string
  summary: string
  details: string
  deliverables: readonly string[]
}

interface ProcessMobileAccordionProps {
  steps: readonly ProcessAccordionStep[]
  openIndex: number
  onOpenChange: (index: number) => void
  ctaLabel: string
  ctaHref: string
}

export function ProcessMobileAccordion({
  steps,
  openIndex,
  onOpenChange,
  ctaLabel,
  ctaHref,
}: ProcessMobileAccordionProps) {
  const prefersReduced = useReducedMotion()
  const baseId = useId()

  return (
    <div className="flex flex-col gap-3">
      {steps.map((step, index) => {
        const isOpen = index === openIndex
        const headerId = `${baseId}-header-${index}`
        const panelId = `${baseId}-panel-${index}`

        return (
          <div
            key={step.step}
            className={cn(
              'rounded-2xl border transition-colors duration-300',
              isOpen
                ? 'border-accent/30 bg-accent/8'
                : 'border-border-subtle bg-bg-surface/75',
            )}
          >
            <h3>
              <button
                id={headerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => onOpenChange(index)}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left"
              >
                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-[10px] font-medium transition-colors',
                    isOpen
                      ? 'border-accent/30 bg-accent-soft text-text-primary'
                      : 'border-border-subtle bg-bg-elevated text-text-secondary',
                  )}
                >
                  {step.step}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      'block text-[var(--text-body)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)]',
                      isOpen ? 'text-text-primary' : 'text-text-secondary',
                    )}
                  >
                    {step.title}
                  </span>
                  <span className="mt-1 block text-[var(--text-meta)] leading-relaxed text-text-secondary">
                    {step.summary}
                  </span>
                </span>
                <svg
                  aria-hidden="true"
                  className={cn(
                    'h-4 w-4 shrink-0 text-text-tertiary transition-transform duration-200',
                    isOpen && 'rotate-180',
                  )}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  initial={prefersReduced ? { opacity: 1 } : { height: 0, opacity: 0 }}
                  animate={prefersReduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                  exit={prefersReduced ? { opacity: 1 } : { height: 0, opacity: 0 }}
                  transition={{ duration: prefersReduced ? 0 : 0.25, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border-subtle px-4 py-4 space-y-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.28em] text-text-secondary">
                        What happens here
                      </p>
                      <p className="mt-2 text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
                        {step.details}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {step.deliverables.map((deliverable) => (
                        <span
                          key={deliverable}
                          className="rounded-2xl border border-border-subtle bg-bg-surface/85 px-3 py-1.5 text-center text-[10px] uppercase tracking-[0.22em] text-text-secondary"
                        >
                          {deliverable}
                        </span>
                      ))}
                    </div>

                    <a
                      href={ctaHref}
                      className="inline-flex items-center justify-center rounded-xl border border-border bg-surface-hover px-4 py-2 text-sm font-medium text-text-primary transition-all hover:bg-surface-hover focus-ring"
                    >
                      {ctaLabel}
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { Section } from '@/components/ui/section'
import { Badge } from '@/components/typography/badge'
import { fadeUpBlur, fadeUpReduced, staggerSlow } from '@/lib/motion-variants'

const STEPS = [
  { step: '01', title: 'Align', summary: 'Understand goals, constraints, and success criteria before writing code.' },
  { step: '02', title: 'Design', summary: 'Architecture, data model, and component tree defined before UI begins.' },
  { step: '03', title: 'Build', summary: 'Iterative development with continuous review checkpoints.' },
  { step: '04', title: 'Deploy', summary: 'Performance audits, accessibility checks, and production deployment.' },
  { step: '05', title: 'Run', summary: 'Monitoring, analytics, and post-launch iteration based on real usage.' },
]

export function ProcessSteps() {
  const prefersReducedMotion = useReducedMotion()
  const contentVariant = prefersReducedMotion ? fadeUpReduced : fadeUpBlur

  return (
    <Section id="process" density="compact">
      <motion.div
        className="flex flex-col gap-4 items-center text-center md:max-w-2xl mx-auto"
        variants={contentVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        <Badge variant="accent">Process</Badge>
        <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
          How projects run
        </h2>
        <p className="max-w-xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
          Every engagement follows the same five-phase flow. The sequence is consistent — the depth adapts to the project.
        </p>
      </motion.div>

      <div className="mt-10 grid gap-4 md:grid-cols-5">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.step}
            variants={contentVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="relative rounded-xl border border-border-subtle bg-bg-surface p-5"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-subtle text-xs font-mono text-accent">
              {s.step}
            </span>
            <h3 className="mt-3 text-sm font-[var(--weight-medium)] text-text-primary">{s.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">{s.summary}</p>
            {i < STEPS.length - 1 && (
              <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 text-text-tertiary/40 text-lg">
                →
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-8 text-center"
        variants={contentVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        <Link
          href="/studio"
          className="inline-flex items-center gap-2 text-sm text-text-secondary underline underline-offset-4 transition-colors hover:text-text-primary"
        >
          Learn more about how I work →
        </Link>
      </motion.div>
    </Section>
  )
}
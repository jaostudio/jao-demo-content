'use client'

import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Section } from '@/components/ui/section'
import { Badge } from '@/components/typography/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Disclosure } from '@/components/ui/disclosure'
import { fadeUp, fadeUpReduced, scaleFade, slideInLeft, slideInReduced, stagger, staggerSlow, MOTION_VARIANTS, STAGGER_TIERS } from '@/lib/motion-variants'
import { cn } from '@/lib/cn'
import { projects } from '@/lib/projects'

const processSteps = [
  {
    step: 'Discovery',
    detail:
      'Understand the problem, users, constraints, and success criteria. Identify technical risks early. Define what "done" looks like before writing any code.',
  },
  {
    step: 'Architecture',
    detail:
      'Design the system — choose the stack, define data flows, establish deployment topology. Make tradeoffs explicit. Document the reasoning.',
  },
  {
    step: 'Implementation',
    detail:
      'Build with production discipline. Iterate with short feedback loops. Every change runs through linting, type-checking, and automated QA before it reaches production.',
  },
  {
    step: 'Testing & QA',
    detail:
      'Cross-browser validation, performance budgets, accessibility checks, and load testing. Each deliverable is verified against the success criteria defined in discovery.',
  },
  {
    step: 'Deployment',
    detail:
      'CI/CD pipeline with preview environments. Zero-downtime rollouts, rollback capability, DNS and SSL configuration. Post-deployment monitoring is active.',
  },
  {
    step: 'Handoff & Support',
    detail:
      'Documentation, knowledge transfer, analytics handover. Ongoing reliability monitoring and a structured process for future changes.',
  },
]

const standards = [
  { area: 'CI/CD', standard: 'Automated lint, typecheck, build, and deploy. Preview deployments on every PR before merging.' },
  { area: 'Analytics', standard: 'Event-based tracking with PostHog. Session IDs, UTM persistence, structured event taxonomy.' },
  { area: 'Performance', standard: 'Budgets enforced in CI. Shared JS <190 kB. Lighthouse targets consistently above 90.' },
  { area: 'Security', standard: 'CSP headers, HSTS, rate limiting, origin validation, Zod-validated API schemas.' },
  { area: 'Email', standard: 'Resend with transactional templates, lead scoring, automated confirmation workflows.' },
  { area: 'Observability', standard: 'Structured logging, Sentry error capture, request correlation IDs.' },
]

const stackChoices = [
  { concern: 'Frontend', choice: 'Next.js + TypeScript', why: 'SSR/SSG flexibility with a mature ecosystem and strong typing.' },
  { concern: 'Styling', choice: 'Tailwind CSS v4', why: 'Design-token-driven, zero-runtime, consistent output across projects.' },
  { concern: 'Animation', choice: 'Framer Motion', why: 'Declarative API with built-in reduced-motion support.' },
  { concern: 'Database', choice: 'PostgreSQL', why: 'Reliable, well-understood, excellent tooling and ecosystem depth.' },
  { concern: 'Analytics', choice: 'PostHog', why: 'Event-first analytics with self-hosting optionality and privacy controls.' },
  { concern: 'Email', choice: 'Resend', why: 'Reliable delivery, modern API, React email templates with type safety.' },
  { concern: 'Validation', choice: 'Zod', why: 'Runtime type safety with composable schemas, framework-agnostic.' },
  { concern: 'Deployment', choice: 'Vercel', why: 'Edge network, instant previews, minimal operational overhead.' },
]

const noGoItems = [
  'WordPress customization or template-based builds — custom architecture only',
  'Rushed overnight delivery — quality requires structured timelines',
  'SEO guarantees — measurable improvements yes, guarantees no',
  'Maintenance for legacy PHP or unmaintained stacks',
  'Unmanaged scope creep — changes handled through structured process',
  'Unpaid discovery or speculative design work',
  'Multi-channel communication sprawl — async-first, organized',
]

const individualApproach = [
  {
    label: 'Direct access',
    detail: 'You work directly with the engineer building the system. No account managers, no handoffs, no communication layers.',
  },
  {
    label: 'Async-first workflow',
    detail: 'Written communication with organized threads. Synchronous calls when they add clarity. No Slack firehose.',
  },
  {
    label: 'Concurrent cap',
    detail: 'Limited to 1–2 active engagements. Every project gets focused attention without context-switching overhead.',
  },
  {
    label: 'Structured scope',
    detail: 'Changes follow a clear process: flag, evaluate impact, adjust timeline or budget, proceed. No silent scope creep.',
  },
  {
    label: 'Production mindset',
    detail: 'Every project — regardless of size — ships with CI/CD, analytics, error monitoring, and documentation.',
  },
]

const structureItems = [
  'Architecture is defined before any UI work begins. Data flows, component boundaries, and deployment topology are decided first.',
  'Reusable primitives are identified during architecture and built during implementation. This reduces duplication across the project.',
  'Scalability is considered upfront — not as premature optimization, but as deliberate decisions about where complexity lives.',
  'Operational readiness is built in: analytics, logging, error tracking, and performance monitoring are configured during development, not after launch.',
  'Documentation captures architectural decisions, environment setup, and deployment procedures. Future maintainers can onboard without tribal knowledge.',
]

function computeMetrics() {
  const lighthouses = projects.map((p) => p.metrics.lighthouse).filter((v) => v > 0)
  const minLh = Math.min(...lighthouses)
  const maxLh = Math.max(...lighthouses)
  const clses = projects
    .map((p) => p.performance?.cls)
    .filter((v): v is string => !!v && v !== 'N/A' && !v.startsWith('N/A'))
  const lcps = projects
    .map((p) => p.performance?.lcp)
    .filter((v): v is string => !!v && v !== 'N/A' && !v.startsWith('N/A'))
  return {
    lighthouseRange: ` ${minLh} – ${maxLh}`,
    totalCount: projects.filter((p) => p.projectTier !== 'concept').length,
    stackUniques: new Set(projects.flatMap((p) => p.stack)).size,
    clsMin: clses.length > 0 ? Math.min(...clses.map((v) => parseFloat(v.replace('~', '')))).toFixed(2) : '<0.05',
    lcpRange: lcps.length > 0 ? `~${Math.min(...lcps.map((v) => parseFloat(v.replace('~', '').replace('s', ''))))}s – ~${Math.max(...lcps.map((v) => parseFloat(v.replace('~', '').replace('s', ''))))}s` : '<2s',
  }
}

export function StudioContent() {
  const t = useTranslations('studio')
  const metrics = computeMetrics()
  const prefersReducedMotion = useReducedMotion()
  const principles = [
    {
      principle: t('principle1Label'),
      implication: t('principle1Implication'),
      outcome: t('principle1Outcome'),
    },
    {
      principle: t('principle2Label'),
      implication: t('principle2Implication'),
      outcome: t('principle2Outcome'),
    },
    {
      principle: t('principle3Label'),
      implication: t('principle3Implication'),
      outcome: t('principle3Outcome'),
    },
    {
      principle: t('principle4Label'),
      implication: t('principle4Implication'),
      outcome: t('principle4Outcome'),
    },
    {
      principle: t('principle5Label'),
      implication: t('principle5Implication'),
      outcome: t('principle5Outcome'),
    },
    {
      principle: t('principle6Label'),
      implication: t('principle6Implication'),
      outcome: t('principle6Outcome'),
    },
  ]
  const [activeStep, setActiveStep] = useState(0)

  return (
    <>
      <Section className="pt-32 md:pt-40">
        <motion.div
          className="flex flex-col gap-4"
          variants={prefersReducedMotion ? fadeUpReduced : fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <Badge variant="accent">{t('badge')}</Badge>
          <h1 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
            {t('heading')}
          </h1>
          <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
            {t('description')}
          </p>
        </motion.div>
      </Section>

      <Section variant="alt" id="principles" glow className="" density="compact">
        <motion.div
          className="flex flex-col gap-4"
          variants={prefersReducedMotion ? fadeUpReduced : fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <Badge variant="accent">Operating Principles</Badge>
          <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
            How I build
          </h2>
          <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
            Six principles that guide every architecture decision, regardless of project size or stack.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-md:hidden"
          variants={prefersReducedMotion ? stagger(0.01) : staggerSlow(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {principles.map((p) => (
            <motion.div key={p.principle} variants={prefersReducedMotion ? fadeUpReduced : scaleFade}>
              <Card className="flex h-full flex-col gap-2" hover={false}>
                <p className="text-[var(--text-card-title)] font-[var(--weight-medium)] text-text-primary">
                  {p.principle}
                </p>
                <p className="text-[var(--text-body)] leading-relaxed text-text-secondary">{p.implication}</p>
                <p className="mt-auto text-xs text-accent">{p.outcome}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 flex flex-col gap-3 md:hidden">
          {principles.map((p) => (
            <Disclosure key={p.principle} title={p.principle}>
              <p className="text-text-primary">{p.implication}</p>
              <p className="mt-2 text-xs text-accent">{p.outcome}</p>
            </Disclosure>
          ))}
        </div>
      </Section>

      <Section id="process" className="" density="normal">
        <motion.div
          className="flex flex-col gap-4"
          variants={prefersReducedMotion ? fadeUpReduced : fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <Badge variant="accent">Engagement Model</Badge>
          <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
            How projects run
          </h2>
          <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
            Every engagement follows the same six-phase flow. The sequence is consistent — the depth per phase adapts
            to the project.
          </p>
        </motion.div>

        <div className="mt-12 lg:grid lg:grid-cols-[1fr_2fr] lg:gap-16">
          <motion.div
            className="hidden flex-col gap-4 lg:flex"
            variants={prefersReducedMotion ? fadeUpReduced : fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <Badge className="self-start">How I Operate</Badge>
            <h3 className="text-[var(--text-card-title)] font-[var(--weight-medium)] text-text-primary">
              Direct, structured, intentional
            </h3>
            <div className="flex flex-col gap-4">
              {individualApproach.map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-text-primary">{item.label}</p>
                  <p className="text-sm leading-relaxed text-text-secondary">{item.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative hidden flex-col lg:block"
            variants={prefersReducedMotion ? stagger(0.01) : stagger(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <div className="absolute left-[11px] top-3 h-[calc(100%-24px)] w-px bg-border-subtle" />
            {processSteps.map((s, i) => (
              <motion.div
                key={s.step}
                variants={prefersReducedMotion ? slideInReduced : slideInLeft}
                className="relative flex gap-6 pb-10 last:pb-0"
              >
                <div className="relative z-10 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-border bg-bg-primary text-[10px] font-medium text-text-tertiary">
                  {i + 1}
                </div>
                <div className="flex flex-col gap-1 pt-0.5">
                  <p className="text-[var(--text-card-title)] font-[var(--weight-medium)] text-text-primary">
                    {s.step}
                  </p>
                  <p className="text-[var(--text-body)] leading-relaxed text-text-secondary">{s.detail}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="lg:hidden">
            <div className="flex flex-wrap justify-center gap-1.5">
              {processSteps.map((s, i) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setActiveStep(i)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-300',
                    activeStep === i
                      ? 'bg-accent text-white'
                      : 'border border-border-subtle text-text-tertiary hover:border-border-active hover:text-text-secondary',
                  )}
                >
                  {s.step}
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-border-subtle bg-bg-surface p-4">
              <p className="text-[var(--text-card-title)] font-[var(--weight-medium)] text-text-primary">
                {processSteps[activeStep].step}
              </p>
              <p className="mt-2 text-[var(--text-body)] leading-relaxed text-text-secondary">
                {processSteps[activeStep].detail}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 lg:hidden">
          <h3 className="text-[var(--text-card-title)] font-[var(--weight-medium)] text-text-primary">
            How I operate
          </h3>
          {individualApproach.map((item) => (
            <Disclosure key={item.label} title={item.label}>
              <p className="text-sm text-text-secondary">{item.detail}</p>
            </Disclosure>
          ))}
        </div>
      </Section>

      <Section variant="alt" id="structure" className="">
        <motion.div
          className="flex flex-col gap-4"
          variants={prefersReducedMotion ? fadeUpReduced : fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <Badge variant="accent">How Projects Are Structured</Badge>
          <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
            Engineered, not assembled
          </h2>
          <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
            Every project follows the same structural approach — from a marketing site to a multi-tenant SaaS
            frontend. The complexity scales, the methodology stays consistent.
          </p>
        </motion.div>

        <motion.ul
          className="mt-12 flex flex-col gap-4"
          variants={prefersReducedMotion ? stagger(0.01) : stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {structureItems.map((item) => (
            <motion.li
              key={item}
              variants={prefersReducedMotion ? slideInReduced : slideInLeft}
              className="flex items-start gap-3 text-[var(--text-body)] leading-relaxed text-text-secondary"
            >
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
              {item}
            </motion.li>
          ))}
        </motion.ul>
      </Section>

      <Section id="standards" className="">
        <motion.div
          className="flex flex-col gap-4"
          variants={prefersReducedMotion ? fadeUpReduced : fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <Badge variant="accent">Production Standards</Badge>
          <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
            What production means
          </h2>
          <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
            These are the operational baselines every project ships with — regardless of budget or timeline.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-3 md:grid-cols-2 max-md:hidden"
          variants={prefersReducedMotion ? stagger(0.01) : stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {standards.map((s) => (
            <motion.div
              key={s.area}
              variants={prefersReducedMotion ? fadeUpReduced : scaleFade}
              className="rounded-xl border border-border-subtle bg-bg-surface p-5"
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary">{s.area}</p>
              <p className="mt-1.5 text-[var(--text-body)] leading-relaxed text-text-secondary">{s.standard}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 flex flex-col gap-3 md:hidden">
          {standards.map((s) => (
            <Disclosure key={s.area} title={s.area}>
              <p className="text-text-primary">{s.standard}</p>
            </Disclosure>
          ))}
        </div>
      </Section>

      <Section variant="alt" id="stack" glow className="">
        <motion.div
          className="flex flex-col gap-4"
          variants={prefersReducedMotion ? fadeUpReduced : fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <Badge variant="accent">Stack Philosophy</Badge>
          <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
            Tools with tradeoffs
          </h2>
          <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
            The technology choices are deliberate. Each tool has a reason, a tradeoff, and a boundary where it stops
            being the right answer.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 overflow-hidden rounded-xl border border-border-subtle max-md:hidden"
          variants={prefersReducedMotion ? fadeUpReduced : fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <div className="grid grid-cols-[1fr_1.5fr_2fr] gap-0 text-sm">
            <div className="border-b border-border-subtle bg-bg-surface px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
              Concern
            </div>
            <div className="border-b border-border-subtle bg-bg-surface px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
              Choice
            </div>
            <div className="border-b border-border-subtle bg-bg-surface px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
              Reasoning
            </div>
            {stackChoices.map((s, i) => (
              <React.Fragment key={s.concern}>
                <div
                  className={cn(
                    'px-4 py-3 text-text-primary',
                    i < stackChoices.length - 1 && 'border-b border-border-subtle',
                  )}
                >
                  {s.concern}
                </div>
                <div
                  className={cn(
                    'px-4 py-3 font-medium text-accent',
                    i < stackChoices.length - 1 && 'border-b border-border-subtle',
                  )}
                >
                  {s.choice}
                </div>
                <div
                  className={cn(
                    'px-4 py-3 text-text-secondary',
                    i < stackChoices.length - 1 && 'border-b border-border-subtle',
                  )}
                >
                  {s.why}
                </div>
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        <div className="mt-12 flex flex-col gap-3 md:hidden">
          {stackChoices.map((s) => (
            <Disclosure key={s.concern} title={s.concern}>
              <p className="font-medium text-accent">{s.choice}</p>
              <p className="mt-1 text-sm text-text-secondary">{s.why}</p>
            </Disclosure>
          ))}
        </div>
      </Section>

      <Section id="filter" className="">
        <motion.div
          className="flex flex-col gap-4"
          variants={prefersReducedMotion ? fadeUpReduced : fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <Badge variant="accent">What I Don&apos;t Do</Badge>
          <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
            Clear boundaries
          </h2>
          <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
                Saying &ldquo;no&rdquo; to the wrong projects is as important as saying &ldquo;yes&rdquo; to the right ones.
                These boundaries protect the quality of every engagement.
          </p>
        </motion.div>

        <motion.ul
          className="mt-12 flex flex-col gap-3"
          variants={prefersReducedMotion ? stagger(0.01) : stagger(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {noGoItems.map((item) => (
            <motion.li
              key={item}
              variants={prefersReducedMotion ? slideInReduced : slideInLeft}
              className="flex items-start gap-3 text-[var(--text-body)] leading-relaxed text-text-secondary"
            >
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-warm" />
              {item}
            </motion.li>
          ))}
        </motion.ul>
      </Section>

      <Section variant="alt" id="benchmarks" glow className="" density="normal">
        <motion.div
          className="flex flex-col gap-4"
          variants={prefersReducedMotion ? fadeUpReduced : fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <Badge variant="accent">Operational Benchmarks</Badge>
          <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
            Measured, not manufactured
          </h2>
          <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
            Aggregated from the project data model. Directional ranges — not vanity numbers.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4"
          variants={prefersReducedMotion ? stagger(0.01) : stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {[
            { value: metrics.lighthouseRange, label: 'Lighthouse Range' },
            { value: metrics.lcpRange, label: 'LCP Range' },
            { value: `< ${metrics.clsMin}`, label: 'CLS Target' },
            { value: `${metrics.totalCount}`, label: 'Production Projects' },
            { value: `${metrics.stackUniques}+`, label: 'Technologies Applied' },
            { value: '<190 kB', label: 'Shared JS Budget' },
            { value: 'Automated', label: 'QA Pipeline' },
            { value: '<2 min', label: 'Vercel Deploy' },
          ].map((m) => (
            <motion.div key={m.label} variants={prefersReducedMotion ? fadeUpReduced : scaleFade}>
              <Card className="border-t border-t-accent-warm/30 p-4 md:p-6" hover={false}>
                <p className="text-[var(--text-section)] font-[var(--weight-medium)] text-text-primary">{m.value}</p>
                <p className="mt-1 text-[var(--text-meta)] text-text-tertiary">{m.label}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <Section id="cta" className=" pb-12" density="normal">
        <motion.div
          className="flex flex-col items-center gap-6 text-center"
          variants={prefersReducedMotion ? fadeUpReduced : fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <Badge variant="accent">Ready to Build?</Badge>
          <h2 className="max-w-xl text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
            Let&apos;s talk about your project
          </h2>
          <p className="max-w-lg text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
            Every engagement starts with a conversation about the problem, the constraints, and what success looks
            like. No commitment required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/projects" size="lg">
              {t('cta')}
            </Button>
            <Button href="/#contact" size="lg" variant="secondary" trackingLabel="studio_cta_contact">
              Discuss a Project
            </Button>
          </div>
        </motion.div>
      </Section>
    </>
  )
}

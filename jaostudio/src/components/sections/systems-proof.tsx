'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { Section } from '@/components/ui/section'
import { Badge } from '@/components/typography/badge'
import { fadeUpBlur, fadeUpReduced, staggerSlow, staggerFast } from '@/lib/motion-variants'

const CATEGORIES = [
  {
    title: 'Digital Products',
    description: 'Customer-facing platforms, lead generation, onboarding, and marketing systems.',
  },
  {
    title: 'Business Operations',
    description: 'Commerce, revenue operations, multi-vendor marketplaces, and order management.',
  },
  {
    title: 'Internal Tools',
    description: 'Dashboards, operations platforms, task management, and team workflow systems.',
  },
  {
    title: 'Secure Applications',
    description: 'Compliance-ready portals, audit trails, role-based access, and data-governed tools.',
  },
]

export function SystemsProof() {
  const prefersReducedMotion = useReducedMotion()
  const contentVariant = prefersReducedMotion ? fadeUpReduced : fadeUpBlur
  const staggerVariant = prefersReducedMotion ? staggerFast(0.03) : staggerSlow(0.05)

  return (
    <Section id="systems" variant="default" glow density="compact">
      <motion.div
        className="flex flex-col gap-4 items-center text-center md:max-w-3xl mx-auto"
        variants={contentVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        <Badge variant="accent">What We Build</Badge>
        <h2 className="text-[var(--text-display)] font-[var(--weight-medium)] leading-[var(--leading-display)] tracking-[var(--tracking-tight)] text-text-primary">
          Systems that solve real business problems
        </h2>
        <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
          Customer-facing platforms, internal tools, and compliance-ready systems.
          Each one independently deployed, fully functional, and built on shared architecture.
        </p>
      </motion.div>

      <motion.div
        className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={staggerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {CATEGORIES.map((cat) => (
          <motion.div
            key={cat.title}
            variants={contentVariant}
            className="group rounded-xl border border-border-subtle bg-bg-surface p-5 transition-shadow hover:shadow-md"
          >
            <h3 className="text-base font-[var(--weight-medium)] text-text-primary">{cat.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">{cat.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mt-10 text-center"
        variants={contentVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        <Link
          href="/demos"
          className="inline-flex items-center gap-2 rounded-lg bg-text-primary px-5 py-2.5 text-sm font-medium text-bg-primary hover:opacity-90"
        >
          Explore all systems →
        </Link>
      </motion.div>
    </Section>
  )
}

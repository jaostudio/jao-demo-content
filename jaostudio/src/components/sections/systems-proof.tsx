'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { Section } from '@/components/ui/section'
import { Badge } from '@/components/typography/badge'
import { SystemsCarousel, type SystemCategory } from '@/components/sections/systems-carousel'
import { fadeUpBlur, fadeUpReduced } from '@/lib/motion-variants'

const CATEGORIES: SystemCategory[] = [
  {
    icon: '🚀',
    title: 'Customer Growth Systems',
    description: 'Turn visitors into leads and customers.',
    includes: ['Landing pages', 'Funnels', 'Analytics dashboards'],
    usedFor: ['Lead generation', 'Conversion optimization'],
    systemId: 'landing',
  },
  {
    icon: '💳',
    title: 'Revenue & Checkout Systems',
    description: 'From catalog to delivery, one platform.',
    includes: ['Product catalogs', 'Checkout flows', 'Order dashboards'],
    usedFor: ['E-commerce', 'Subscription management'],
    systemId: 'commerce',
  },
  {
    icon: '⚙️',
    title: 'Operations & Workflow Systems',
    description: 'One platform for every org in your company.',
    includes: ['Task managers', 'Kanban boards', 'Role dashboards'],
    usedFor: ['Team coordination', 'Process automation'],
    systemId: 'webapp',
  },
  {
    icon: '🔒',
    title: 'Compliance & Access Systems',
    description: 'Who did what, when - and who allowed it.',
    includes: ['Audit trails', 'Role systems', 'Data portals'],
    usedFor: ['Access control', 'Regulatory compliance'],
    systemId: 'security',
  },
]

export function SystemsProof() {
  const prefersReducedMotion = useReducedMotion()
  const contentVariant = prefersReducedMotion ? fadeUpReduced : fadeUpBlur

  return (
    <Section id="systems" variant="default" glow density="compact">
      <motion.div
        className="flex flex-col gap-3 items-center text-center md:max-w-3xl mx-auto md:gap-4"
        variants={contentVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        <Badge variant="accent">What I Build</Badge>
        <h2 className="text-[var(--text-display)] font-[var(--weight-medium)] leading-[var(--leading-display)] tracking-[var(--tracking-tight)] text-text-primary">
          Systems that solve real business problems
        </h2>
        <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
          Customer-facing platforms, internal tools, and compliance-ready systems.
          Each one independently deployed, fully functional, and built on shared architecture.
        </p>
      </motion.div>

      <div className="flex flex-col gap-4 md:gap-6 mt-4 md:mt-6">
        <div>
          <SystemsCarousel categories={CATEGORIES} />
        </div>

        <motion.div
          className="text-center"
          variants={contentVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <Link
            href="/demos"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-base font-medium text-white transition-transform duration-200 hover:brightness-110 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-accent"
          >
            Explore all systems →
          </Link>
        </motion.div>
      </div>
    </Section>
  )
}

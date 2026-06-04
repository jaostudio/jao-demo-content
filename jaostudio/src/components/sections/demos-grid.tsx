'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { fadeUpBlur, fadeUpReduced, staggerSlow, staggerFast } from '@/lib/motion-variants'
import { SYSTEMS } from '@/lib/systems'

const SYSTEM_DESCRIPTIONS: Record<string, string> = {
  landing: 'Turn visitors into booked appointments',
  commerce: 'From catalog to delivery, one platform',
  marketplace: 'Run a marketplace, not a spreadsheet of vendors',
  content: 'From pitch to publish, tracked at every state',
  webapp: 'One platform for every org in your company',
  security: 'Who did what, when — and who allowed it',
}

function scrollToSystem(id: string) {
  const el = document.getElementById(`system-${id}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export function DemosGrid() {
  const prefersReducedMotion = useReducedMotion()
  const contentVariant = prefersReducedMotion ? fadeUpReduced : fadeUpBlur
  const staggerVariant = prefersReducedMotion ? staggerFast(0.03) : staggerSlow(0.05)

  return (
    <div>
      <p className="mb-4 text-xs uppercase tracking-[0.2em] text-text-tertiary text-center">
        Select a system to explore
      </p>
      <motion.div
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        variants={staggerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {SYSTEMS.map((system) => (
          <motion.button
            key={system.id}
            variants={contentVariant}
            onClick={() => scrollToSystem(system.id)}
            className="group rounded-xl border border-border-subtle bg-bg-surface p-4 text-left transition-all hover:border-accent/30 hover:shadow-sm"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary">{system.category}</p>
            <h3 className="mt-1 text-sm font-[var(--weight-medium)] text-text-primary">{system.name}</h3>
            <p className="mt-1 text-xs leading-relaxed text-text-secondary">{SYSTEM_DESCRIPTIONS[system.id]}</p>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}

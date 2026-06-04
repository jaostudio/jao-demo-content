'use client'

import { useState } from 'react'
import { AnimatePresence, motion, type Transition } from 'framer-motion'
import Image from 'next/image'

export interface ProofItem {
  title: string
  context: string
  outcome: string
}

export interface SystemContent {
  name: string
  category: string
  description: string
  useCase: string
  features: string[]
  url: string
  screenshot: string
  proof: ProofItem[]
}

interface SystemTab {
  id: string
  name: string
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

const transition: Transition = { duration: 0.3, ease: [0.16, 1, 0.3, 1] }

export function ActiveSystemView({
  systems,
  systemDetails,
}: {
  systems: SystemTab[]
  systemDetails: Record<string, SystemContent>
}) {
  const [activeId, setActiveId] = useState(systems[0]?.id ?? '')
  const active = activeId ? systemDetails[activeId] : null

  return (
    <div>
      <p className="mb-4 text-xs uppercase tracking-[0.2em] text-text-tertiary text-center">
        Select a system to explore
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {systems.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveId(s.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              s.id === activeId
                ? 'bg-accent text-white'
                : 'border border-border-subtle bg-bg-surface text-text-secondary hover:border-accent/30'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={activeId}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={transition}
            className="mt-10"
          >
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-accent">{active.category}</p>
                  <h2 className="mt-2 text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
                    {active.name}
                  </h2>
                  <p className="mt-3 text-[var(--text-body)] leading-relaxed text-text-secondary">
                    {active.description}
                  </p>

                  <div className="mt-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary">Use case</p>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">{active.useCase}</p>
                  </div>

                  <div className="mt-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary">Features</p>
                    <ul className="mt-2 space-y-1.5">
                      {active.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {active.proof.length > 0 && (
                    <div className="mt-6">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary">Selected Work</p>
                      <p className="mt-0.5 text-xs text-text-tertiary">Used in real deployments</p>
                      <div className="mt-3 space-y-3">
                        {active.proof.map((p) => (
                          <div key={p.title} className="rounded-lg border border-border-subtle bg-bg-surface p-4">
                            <p className="text-sm font-medium text-text-primary">{p.title}</p>
                            <p className="mt-0.5 text-xs text-text-tertiary">{p.context}</p>
                            <p className="mt-1 text-xs leading-relaxed text-text-secondary">{p.outcome}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <a
                      href={active.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-text-primary px-5 py-2.5 text-sm font-medium text-bg-primary hover:opacity-90"
                    >
                      Open Live System →
                    </a>
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-border-subtle">
                  <Image
                    src={active.screenshot}
                    alt={`${active.name} screenshot`}
                    width={1440}
                    height={900}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { easeOut } from '@/lib/motion-variants'

export interface ProofItem {
  title: string
  context: string
  outcome: string
}

export interface SystemContent {
  uiLabel: string
  uiSubtitle?: string
  name: string
  category: string
  description: string
  useCase: string
  features: string[]
  url: string
  screenshot: string
  proof: ProofItem[]
}

const contentTransition = { duration: 0.2, ease: easeOut }

export function ActiveSystemView({
  systems,
  systemDetails,
}: {
  systems: { id: string }[]
  systemDetails: Record<string, SystemContent>
}) {
  const [activeId, setActiveId] = useState(systems[0]?.id ?? '')
  const active = activeId ? systemDetails[activeId] : null
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })
  }

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })
  }

  const handleTabClick = (id: string) => {
    setActiveId(id)
    const el = scrollRef.current
    if (!el) return
    const tab = el.querySelector(`[data-tab-id="${id}"]`) as HTMLElement | null
    if (!tab) return
    tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  if (!active) return null

  const label = active.uiLabel

  return (
    <div>
      {/* Context line */}
      <p className="mb-2 text-center text-sm text-text-secondary">
        Helping businesses <span className="font-medium text-accent">{label.toLowerCase()}</span> through digital systems
      </p>

      {/* Tab bar with arrows */}
      <div className="relative group">
        <button
          onClick={scrollLeft}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border-subtle bg-bg-elevated p-1.5 text-text-secondary opacity-0 shadow-lg transition-all hover:bg-bg-surface hover:text-text-primary group-hover:opacity-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div
          ref={scrollRef}
          className="mx-8 flex flex-nowrap gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory"
        >
          {systems.map((s) => {
            const detail = systemDetails[s.id]
            if (!detail) return null
            const isActive = s.id === activeId
            return (
              <button
                key={s.id}
                data-tab-id={s.id}
                onClick={() => handleTabClick(s.id)}
                className={`snap-start shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-[transform,opacity,background-color] duration-200 ${
                  isActive
                    ? 'bg-accent text-white shadow-md scale-[1.03]'
                    : 'bg-bg-surface text-text-secondary border border-border-subtle opacity-70 hover:opacity-100'
                }`}
              >
                {detail.uiLabel}
              </button>
            )
          })}
        </div>

        <button
          onClick={scrollRight}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border-subtle bg-bg-elevated p-1.5 text-text-secondary opacity-0 shadow-lg transition-all hover:bg-bg-surface hover:text-text-primary group-hover:opacity-100"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-2 text-center text-xs text-text-tertiary">
        Currently viewing: {label}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={contentTransition}
          className="mt-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
              <div>
                <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
                  {label}
                </h2>
                <p className="mt-1 text-sm text-text-tertiary">{active.name}</p>
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
                  alt={`${label} screenshot`}
                  width={1440}
                  height={900}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

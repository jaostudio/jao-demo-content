'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, UserPlus, ShoppingCart, Share2, FileText, Settings, Shield } from 'lucide-react'
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
  outcome: string
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
  activeId,
  onActiveChange,
}: {
  systems: { id: string }[]
  systemDetails: Record<string, SystemContent>
  activeId: string
  onActiveChange: (id: string) => void
}) {
  const [hasOverflow, setHasOverflow] = useState(false)
  const active = activeId ? systemDetails[activeId] : null
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const check = () => {
      setHasOverflow(el.scrollWidth > el.clientWidth + 1)
    }
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' })
  }

  const handleTabClick = (id: string) => {
    onActiveChange(id)
    const el = scrollRef.current
    if (!el) return
    const tab = el.querySelector(`[data-tab-id="${id}"]`) as HTMLElement | null
    if (!tab) return
    tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  if (!active) return null

  const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    landing: UserPlus,
    commerce: ShoppingCart,
    marketplace: Share2,
    content: FileText,
    webapp: Settings,
    security: Shield,
  }

  return (
    <div>
      <div className="relative group flex justify-center">
        <div className="relative max-w-full">
          {hasOverflow && (
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border-subtle bg-bg-elevated p-1.5 text-text-secondary opacity-0 shadow-lg transition-all hover:bg-bg-surface hover:text-text-primary group-hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          <div
            ref={scrollRef}
            className={`overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${hasOverflow ? 'px-8' : ''}`}
          >
            <div className="flex flex-nowrap gap-2 w-max mx-auto">
              {systems.map((s) => {
                const detail = systemDetails[s.id]
                if (!detail) return null
                const isActive = s.id === activeId
                const Icon = ICON_MAP[s.id]
                return (
                  <button
                    key={s.id}
                    data-tab-id={s.id}
                    onClick={() => handleTabClick(s.id)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-[transform,opacity,background-color] duration-200 inline-flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-accent text-white shadow-md scale-[1.03]'
                        : 'bg-bg-surface text-text-secondary border border-border-subtle opacity-70 hover:opacity-100'
                    }`}
                  >
                    {Icon && <Icon className={`h-5 w-5 ${!isActive ? 'opacity-60' : ''}`} />}
                    {detail.uiLabel}
                  </button>
                )
              })}
            </div>
          </div>

          {hasOverflow && (
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border-subtle bg-bg-elevated p-1.5 text-text-secondary opacity-0 shadow-lg transition-all hover:bg-bg-surface hover:text-text-primary group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

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
            <div className="rounded-xl border border-border-subtle bg-bg-surface p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:items-center">
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
                      {active.uiLabel}
                    </h2>
                    <p className="mt-1 text-sm text-text-tertiary">{active.name}</p>
                  </div>
                  <p className="text-base leading-relaxed text-text-secondary">{active.outcome}</p>
                  <div className="flex flex-col gap-2">
                    <a
                      href={active.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="self-start inline-flex items-center gap-2 rounded-xl bg-text-primary px-6 py-3 text-sm font-medium text-bg-primary transition-all hover:opacity-90 active:scale-[0.99]"
                    >
                      Try This System →
                    </a>
                    <p className="text-xs text-text-tertiary">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-accent" />
                        Independently Deployed
                      </span>
                      <span className="mx-2 opacity-30">·</span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-accent" />
                        Production Ready
                      </span>
                      <span className="mx-2 opacity-30">·</span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-accent" />
                        Shared Platform
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
                    PRODUCTION PREVIEW
                  </p>
                  <div className="mt-1 overflow-hidden rounded-lg border border-border-subtle shadow-2xl ring-1 ring-white/10 scale-[1.02]">
                    <div className="flex items-center gap-1.5 border-b border-border-subtle bg-bg-secondary px-3 py-1.5">
                      <span className="h-2 w-2 rounded-full bg-red-500 opacity-80" />
                      <span className="h-2 w-2 rounded-full bg-yellow-500 opacity-80" />
                      <span className="h-2 w-2 rounded-full bg-green-500 opacity-80" />
                    </div>
                    <div className="relative">
                      <Image
                        src={active.screenshot}
                        alt={`${active.uiLabel} screenshot`}
                        width={1440}
                        height={900}
                        className="w-full"
                      />
                      <span className="absolute bottom-1.5 right-1.5 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-medium text-white">
                        Live System
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="mx-auto max-w-3xl">
              <div className="border-l-2 border-accent pl-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary">Problem</p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">{active.useCase}</p>
              </div>

              <div className="mt-6 border-l-2 border-accent pl-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary">Solution</p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">{active.description}</p>
              </div>

              <div className="mt-6 border-l-2 border-accent pl-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary">System Behavior</p>
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
                  href="#architecture"
                  className="text-sm font-medium text-text-secondary underline underline-offset-4 transition-colors hover:text-text-primary"
                >
                  View Architecture →
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

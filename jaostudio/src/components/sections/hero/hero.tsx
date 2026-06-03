'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, useReducedMotion } from 'framer-motion'
import { useMediaQuery } from '@/lib/hooks/use-media-query'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/typography/badge'
import { LayeredFrame } from '@/components/ui/layout/layered-frame'
import { useSystem, useActiveNode } from '@/components/layout/system-provider'
import { useTranslations } from 'next-intl'
import {
  fadeUpBlur, fadeUpReduced,
  heroFloat, heroFloatReduced,
  slideInLeft, slideInRight, slideInReduced,
  staggerSlow, staggerFast,
} from '@/lib/motion-variants'

const DynamicNodeGraph = dynamic(
  () => import('@/components/system/node-graph').then((mod) => ({ default: mod.NodeGraph })),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-[1rem] bg-surface-hover animate-pulse" style={{ height: 220 }} />
    ),
  }
)

const nodeMetrics: Record<
  string,
  { label: string; value: string; metric: string }[]
> = {
  orchestrator: [
    { label: 'Control Plane', value: 'All systems nominal', metric: '99.9% uptime' },
    { label: 'Throughput', value: '1.2k req/s', metric: '+12% this week' },
  ],
  platform: [
    { label: 'Deployments', value: '3 active environments', metric: '99.8% uptime' },
    { label: 'Health', value: 'All checks passing', metric: '12ms avg latency' },
  ],
  pipeline: [
    { label: 'Workflows', value: '4 pipelines running', metric: '98.5% pass rate' },
    { label: 'Throughput', value: '840 ops/min', metric: '2 queued' },
  ],
  inference: [
    { label: 'Models', value: '3 deployed', metric: '12ms avg latency' },
    { label: 'Load', value: '65% capacity', metric: '+8% this week' },
  ],
  data: [
    { label: 'Storage', value: '2.4 TB managed', metric: '72% utilized' },
    { label: 'Cache', value: '340 req/s', metric: '99.7% hit rate' },
  ],
}

const defaultMetrics = [
  { label: 'Orchestration', value: 'Multi-service automation workflow', metric: '3 active services' },
  { label: 'Infrastructure', value: 'Scale-aware deployment pipeline', metric: '99.9% uptime' },
]

export function Hero() {
  const t = useTranslations('hero')
  const prefersReducedMotion = useReducedMotion()
  const { sim } = useSystem()
  const activeNode = useActiveNode()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [displayMetrics, setDisplayMetrics] = useState(defaultMetrics)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const contentVariant = prefersReducedMotion ? fadeUpReduced : fadeUpBlur
  const heroVariant = prefersReducedMotion ? heroFloatReduced : heroFloat
  const slideVariant = prefersReducedMotion ? slideInReduced : slideInLeft
  const slideRightVariant = prefersReducedMotion ? slideInReduced : slideInRight
  const staggerVariant = prefersReducedMotion ? staggerFast(0.03) : staggerSlow(0.05)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeNode && activeNode in nodeMetrics) {
        setDisplayMetrics(nodeMetrics[activeNode])
      } else {
        setDisplayMetrics(defaultMetrics)
      }
      setIsTransitioning(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(false)
        })
      })
    }, 150)
    return () => clearTimeout(timer)
  }, [activeNode])

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 30% 20%, rgba(124,58,237,0.10), transparent 60%)',
        }}
      />

      <LayeredFrame className="pt-20 lg:pt-28" glow>
        <div className="grid gap-6 lg:gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <motion.div
            className="flex flex-col gap-5 md:gap-9"
            variants={staggerVariant}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={contentVariant}>
              <Badge variant="accent">{t('badge')}</Badge>
            </motion.div>

            <motion.div variants={heroVariant} className="flex flex-col gap-3 md:gap-4">
              <h1 className="max-w-4xl text-[var(--text-hero)] font-[var(--weight-medium)] leading-[var(--leading-display)] tracking-[var(--tracking-tight)] text-text-primary">
                {t('headline')}
              </h1>
              <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
                {t('subtitle')}
              </p>
              <div className="flex flex-wrap gap-2 max-sm:hidden">
                <span className="rounded-full border border-accent-warm/20 bg-accent-warm-soft px-3 py-1 text-[11px] text-accent-warm">
                  {t('availability')}
                </span>
              </div>
            </motion.div>

            <motion.div className="flex flex-col gap-3 sm:flex-row sm:gap-4" variants={slideVariant}>
              <Button
                href="/#contact"
                size="lg"
                trackingLabel="hero_start_project"
                className="w-full sm:w-auto text-base py-3 sm:text-sm sm:py-2.5"
              >
                {t('ctaPrimary')}
              </Button>
              <Button
                href="/#work"
                variant="secondary"
                size="lg"
                trackingLabel="hero_view_projects"
                className="w-full sm:w-auto text-sm py-3 sm:py-2.5"
              >
                {t('ctaSecondary')}
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            variants={slideRightVariant}
            initial="hidden"
            animate="visible"
          >
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-accent/10 via-transparent to-accent-warm/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border-subtle bg-bg-surface p-4 shadow-elevated md:p-7" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-text-secondary">
                    {t('systemTopology')}
                  </p>
                </div>
                <span className="rounded-full border border-accent-warm/20 bg-accent-warm-soft px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-accent-warm">
                  {t('live')}
                </span>
              </div>

              <div className="mt-3 md:mt-4">
                <DynamicNodeGraph
                  className={isMobile ? 'h-[220px]' : 'h-[200px] sm:h-[260px] md:h-[340px]'}
                  sim={sim}
                  compact={isMobile}
                />
              </div>

              <div
                className="mt-3 md:mt-4 grid gap-2 sm:grid-cols-2 transition-opacity duration-300"
                style={{ opacity: isTransitioning ? 0.5 : 1 }}
              >
                {displayMetrics.slice(0, prefersReducedMotion ? 1 : 2).map((item) => (
                  <div
                    key={`${item.label}-${item.value}`}
                    className="rounded-2xl border border-border-subtle bg-bg-surface/80 px-3 py-2 md:px-4 md:py-3"
                  >
                    <p className="text-[10px] uppercase tracking-[0.28em] text-text-secondary">{item.label}</p>
                    <p className="mt-1 text-sm text-text-secondary">{item.value}</p>
                    <p className="mt-0.5 text-[11px] text-text-tertiary/60">{item.metric}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </LayeredFrame>
    </section>
  )
}

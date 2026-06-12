'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, useReducedMotion } from 'framer-motion'
import { useMediaQuery } from '@/lib/hooks/use-media-query'
import { useSystem, useActiveNode } from '@/components/layout/system-provider'
import { useTranslations } from 'next-intl'
import { slideInRight, slideInReduced } from '@/lib/motion-variants'

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
    { label: 'Control Plane', value: 'API gateway & routing', metric: 'Request handling' },
    { label: 'Throughput', value: 'Load-balanced traffic', metric: 'Horizontal scaling' },
  ],
  platform: [
    { label: 'Deployments', value: 'Preview & production', metric: 'CI/CD pipeline' },
    { label: 'Health', value: 'Automated monitoring', metric: 'Error tracking active' },
  ],
  pipeline: [
    { label: 'Workflows', value: 'Build, test, deploy', metric: 'Automated pipeline' },
    { label: 'Throughput', value: 'Concurrent builds', metric: 'Parallel processing' },
  ],
  inference: [
    { label: 'Models', value: 'Server-side logic', metric: 'API-driven' },
    { label: 'Load', value: 'On-demand scaling', metric: 'Usage-based' },
  ],
  data: [
    { label: 'Storage', value: 'PostgreSQL database', metric: 'Managed by Vercel' },
    { label: 'Cache', value: 'CDN edge caching', metric: 'Global distribution' },
  ],
}

const defaultMetrics = [
  { label: 'Orchestration', value: 'Multi-service architecture', metric: 'Demo topology' },
  { label: 'Infrastructure', value: 'Vercel edge network', metric: 'Global deployment' },
]

export function HeroVisual() {
  const t = useTranslations('hero')
  const prefersReducedMotion = useReducedMotion()
  const { sim } = useSystem()
  const activeNode = useActiveNode()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [displayMetrics, setDisplayMetrics] = useState(defaultMetrics)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const slideRightVariant = prefersReducedMotion ? slideInReduced : slideInRight

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
    <motion.div
      className="relative"
      variants={slideRightVariant}
      initial="hidden"
      animate="visible"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-accent/10 via-transparent to-accent-warm/10 blur-3xl" />
      <div
        className="relative overflow-hidden rounded-[2rem] border border-border-subtle bg-bg-surface p-4 shadow-elevated md:p-7"
        style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">
              {t('systemTopology')}
            </p>
          </div>
          <span className="rounded-full border border-accent-warm/30 bg-bg-elevated px-3 py-1 text-xs uppercase tracking-[0.25em] text-accent-warm">
            {t('live')}
          </span>
        </div>

        <div className="mt-3 md:mt-4">
          <DynamicNodeGraph
            className={isMobile ? 'h-[160px]' : 'h-[200px] sm:h-[260px] md:h-[340px]'}
            sim={sim}
            compact={isMobile}
          />
        </div>

        <div
          className="mt-3 md:mt-4 grid gap-2 sm:grid-cols-2 transition-opacity duration-300"
          style={{ opacity: isTransitioning ? 0.5 : 1 }}
        >
          {displayMetrics.slice(0, isMobile ? 1 : prefersReducedMotion ? 1 : 2).map((item) => (
            <div
              key={`${item.label}-${item.value}`}
              className="rounded-2xl border border-border-subtle bg-bg-surface/80 px-3 py-2 md:px-4 md:py-3"
            >
              <p className="text-sm uppercase tracking-[0.28em] text-text-secondary">{item.label}</p>
              <p className="mt-1 text-base text-text-secondary">{item.value}</p>
              <p className="mt-0.5 text-sm text-text-tertiary">{item.metric}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

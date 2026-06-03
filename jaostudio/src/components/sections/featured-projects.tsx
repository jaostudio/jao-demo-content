'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Section } from '@/components/ui/section'
import { Badge } from '@/components/typography/badge'
import { ProjectsCarousel } from '@/components/projects/projects-carousel'
import { projects } from '@/lib/projects'
import { fadeUpBlur, fadeUpReduced } from '@/lib/motion-variants'
import { useActiveNode } from '@/components/layout/system-provider'
import { useTranslations } from 'next-intl'

const nodeRelevance: Record<string, string[]> = {
  platform: ['web-application', 'landing-page'],
  pipeline: ['isp-platform'],
  data: ['isp-platform'],
  inference: [],
}

export function FeaturedProjects() {
  const prefersReducedMotion = useReducedMotion()
  const activeNode = useActiveNode()
  const t = useTranslations('projects')
  const published = projects.filter((p) => p.projectTier !== 'concept')

  const relevantSlugs = useMemo(() => {
    if (!activeNode) return []
    return nodeRelevance[activeNode] ?? []
  }, [activeNode])

  if (!published.length) return null

  return (
    <Section id="work" variant="default" glow density="compact" className="">
      <motion.div
        className="flex flex-col gap-4 items-center text-center md:max-w-3xl mx-auto"
        variants={prefersReducedMotion ? fadeUpReduced : fadeUpBlur}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        <Badge variant="accent">{t('badge')}</Badge>
        <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
          {t('heading')}
        </h2>
        <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
          {t('description')}
        </p>
      </motion.div>

      <div className="mt-8">
        <ProjectsCarousel projects={published} relevantSlugs={relevantSlugs} />
      </div>
    </Section>
  )
}

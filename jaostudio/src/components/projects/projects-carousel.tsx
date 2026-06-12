'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useMotionValue, motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/typography/badge'
import { ProjectTierBadge } from '@/components/projects/project-tier-badge'
import { trackProjectClick } from '@/lib/analytics'
import type { ProjectMetadata } from '@/types'

interface Props {
  projects: ProjectMetadata[]
  relevantSlugs: string[]
}

const SPEED = 50

function ProjectCarouselCard({ project, relevant = false }: { project: ProjectMetadata; relevant?: boolean }) {
  return (
    <Link href={`/projects/${project.slug}`} onClick={() => trackProjectClick(project.title, 'homepage_featured')}>
      <Card className="group flex h-full w-[300px] flex-col gap-4 p-6 sm:w-[340px] md:w-[380px]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge>{project.industry}</Badge>
            <ProjectTierBadge tier={project.projectTier} />
          </div>
          {relevant && (
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" style={{ animationDuration: '2s' }} />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-text-secondary">Project</p>
            <h3 className="mt-0.5 text-[var(--text-card-title)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
              {project.title}
            </h3>
          </div>

          <p className="text-base leading-relaxed text-text-secondary">{project.summary}</p>
        </div>

        <div className="space-y-2 transition-opacity duration-300 opacity-60 group-hover:opacity-100">
          <p className="text-xs leading-relaxed text-text-tertiary line-clamp-1">
            {project.industry} · {project.timeline}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {project.stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-border-subtle bg-bg-elevated px-2 py-0.5 text-xs text-text-secondary"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-text-secondary">
            <span>{project.metrics.lighthouse}+ Lighthouse</span>
            <span>{project.metrics.performance}</span>
          </div>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-accent px-4 py-3 min-h-[44px] text-sm font-medium text-white transition-[filter,transform] hover:brightness-110 active:scale-[0.99]">
          <span>View Project Sample</span>
          <ArrowRight className="h-4 w-4" />
        </span>
      </Card>
    </Link>
  )
}

export function ProjectsCarousel({ projects, relevantSlugs }: Props) {
  const x = useMotionValue(0)
  const [isPaused, setIsPaused] = useState(false)
  const [setWidth, setSetWidth] = useState(0)
  const innerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isVisibleRef = useRef(true)

  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    const measure = () => setSetWidth(el.scrollWidth / 2)

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [projects.length])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
      },
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (setWidth <= 0) return

    let rafId: number
    let lastTime = performance.now()

    function tick() {
      const now = performance.now()

      if (isPaused || !isVisibleRef.current) {
        lastTime = now
        rafId = requestAnimationFrame(tick)
        return
      }

      const dt = (now - lastTime) / 1000
      lastTime = now

      let newX = x.get() - SPEED * dt
      if (newX <= -setWidth) {
        newX = newX + setWidth
      }
      x.set(newX)

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [isPaused, setWidth, x])

  const slotWidth = setWidth > 0 ? setWidth / projects.length : 0

  const scrollLeft = useCallback(() => {
    const currentX = x.get()
    x.set(Math.min(currentX + slotWidth, 0))
  }, [x, slotWidth])

  const scrollRight = useCallback(() => {
    const currentX = x.get()
    let newX = currentX - slotWidth
    if (newX < -setWidth) {
      newX = newX + setWidth
    }
    x.set(newX)
  }, [x, slotWidth, setWidth])

  const doubled = [...projects, ...projects]

  return (
    <div
      ref={containerRef}
      className="group relative overflow-hidden rounded-[2rem] border border-border-subtle bg-surface-hover"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <button
        onClick={scrollLeft}
        aria-label="Scroll left"
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border-subtle bg-bg-elevated p-2 text-text-secondary opacity-0 shadow-lg transition-[color,background-color,opacity] hover:bg-bg-surface hover:text-text-primary group-hover:opacity-100"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={scrollRight}
        aria-label="Scroll right"
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border-subtle bg-bg-elevated p-2 text-text-secondary opacity-0 shadow-lg transition-[color,background-color,opacity] hover:bg-bg-surface hover:text-text-primary group-hover:opacity-100"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <motion.div
        ref={innerRef}
        className="flex gap-5 px-3 py-3"
        style={{ x }}
      >
        {doubled.map((project, i) => (
          <div key={`${project.slug}-${i}`} className="flex-shrink-0">
            <ProjectCarouselCard
              project={project}
              relevant={relevantSlugs.includes(project.slug)}
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

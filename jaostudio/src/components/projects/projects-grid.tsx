'use client'

import { useRef, useEffect, useCallback } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/typography/badge'
import { ProjectTierBadge } from '@/components/projects/project-tier-badge'
import { ProjectCardLink } from '@/components/projects/project-card-link'
import type { ProjectMetadata } from '@/types'

interface Props {
  projects: ProjectMetadata[]
}

export function ProjectsGrid({ projects }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const paused = useRef(false)
  const lastTime = useRef<number | null>(null)
  const rafId = useRef(0)
  const halfWidth = useRef(0)

  const doubled = [...projects, ...projects]

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const measure = () => {
      if (!containerRef.current) return
      halfWidth.current = containerRef.current.scrollWidth / 2
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)

    const tick = (now: number) => {
      if (!paused.current) {
        if (lastTime.current !== null) {
          const dt = (now - lastTime.current) / 1000
          const next = x.get() - 50 * dt
          x.set(next <= -halfWidth.current ? next + halfWidth.current : next)
        }
        lastTime.current = now
      } else {
        lastTime.current = null
      }
      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId.current)
      ro.disconnect()
    }
  }, [x])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      paused.current = !e.isIntersecting
    }, { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const onDragStart = useCallback(() => {
    paused.current = true
  }, [])

  const onDragEnd = useCallback(() => {
    lastTime.current = null
    setTimeout(() => {
      paused.current = false
    }, 2000)
  }, [])

  const renderCard = (project: ProjectMetadata) => (
    <ProjectCardLink slug={project.slug}>
      <Card className="grid h-full grid-rows-[auto_1fr_auto] gap-4">
        <div className="flex items-center gap-2">
          <Badge>{project.industry}</Badge>
          <ProjectTierBadge tier={project.projectTier} />
        </div>

        <div className="row-start-2 flex flex-col gap-2">
          <h3 className="text-[var(--text-card-title)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
            {project.title}
          </h3>
          {project.systems?.architecture && (
            <p className="text-[var(--text-body)] leading-relaxed text-text-secondary line-clamp-2">
              {project.systems.architecture}
            </p>
          )}
          <p className="text-sm text-text-tertiary line-clamp-2 min-h-[96px]">
            {project.summary}
          </p>
        </div>

        <div className="row-end-3 flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            {project.stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-border-subtle bg-bg-elevated px-2 py-0.5 text-xs text-text-tertiary"
              >
                {tech}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-[var(--text-meta)] text-text-tertiary">
            <span>{project.metrics.lighthouse}+ Lighthouse</span>
            <span>{project.metrics.performance}</span>
          </div>
        </div>
      </Card>
    </ProjectCardLink>
  )

  return (
    <>
      <div className="md:hidden">
        <motion.div
          ref={containerRef}
          className="flex gap-4 overflow-hidden px-6 -mx-6 cursor-grab active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          role="list"
          aria-label="Project cards"
        >
          {doubled.map((project, i) => (
            <div key={`${project.slug}-${i}`} className="w-[85vw] shrink-0">
              {renderCard(project)}
            </div>
          ))}
        </motion.div>
      </div>

      <div
        className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        role="list"
        aria-label="Project cards"
      >
        {projects.map((project) => (
          <div key={project.slug}>
            {renderCard(project)}
          </div>
        ))}
      </div>
    </>
  )
}

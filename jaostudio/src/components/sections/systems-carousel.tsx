'use client'

import { useEffect, useRef, useState } from 'react'
import { useMotionValue, motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'

export interface SystemCategory {
  icon: string
  title: string
  description: string
  includes: string[]
  usedFor: string[]
  systemId?: string
}

interface Props {
  categories: SystemCategory[]
}

const SPEED = 50

function SystemCarouselCard({ category }: { category: SystemCategory }) {
  const href = category.systemId ? `/demos?system=${category.systemId}` : '/demos'
  return (
    <Link href={href}>
      <Card className="group flex h-full w-[300px] flex-col gap-4 p-6 sm:w-[340px] md:w-[380px]">
        <div className="flex items-center gap-2">
          <span className="text-2xl leading-relaxed">{category.icon}</span>
          <h3 className="text-base font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
            {category.title}
          </h3>
        </div>

        <p className="text-base leading-relaxed text-text-secondary">
          {category.description}
        </p>

        <div>
          <p className="text-xs uppercase tracking-widest text-text-tertiary">What this includes</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {category.includes.map((item) => (
              <span
                key={item}
                className="rounded-md border border-border-subtle bg-bg-elevated px-2 py-0.5 text-xs text-text-secondary"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-text-tertiary">Used for</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-text-secondary">
            {category.usedFor.map((item) => (
              <span key={item} className="flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-accent" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <span className="mt-auto inline-flex w-fit items-center gap-2 rounded-lg bg-accent px-4 py-3 min-h-[44px] text-base font-medium text-white transition-[filter,transform] hover:brightness-110 active:scale-[0.99]">
          <span>Explore systems</span>
          <ArrowRight className="h-4 w-4" />
        </span>
      </Card>
    </Link>
  )
}

export function SystemsCarousel({ categories }: Props) {
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
  }, [categories.length])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
      },
      { threshold: 0 },
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

  const doubled = [...categories, ...categories]

  return (
    <div
      ref={containerRef}
      className="group relative overflow-hidden rounded-[2rem] border border-border-subtle bg-surface-hover"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        ref={innerRef}
        className="flex gap-5 px-3 py-3"
        style={{ x }}
      >
        {doubled.map((cat, i) => (
          <div key={`${cat.title}-${i}`} className="flex-shrink-0">
            <SystemCarouselCard category={cat} />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

'use client'

import { useRef, useEffect, useState } from 'react'

interface RevealProps {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'section' | 'article'
}

export function Reveal({ children, className = '', as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 420ms var(--ease-out-soft), transform 420ms var(--ease-out-soft)',
      }}
    >
      {children}
    </Tag>
  )
}

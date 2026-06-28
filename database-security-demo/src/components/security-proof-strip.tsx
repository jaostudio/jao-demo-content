'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface CounterProps {
  end: number
  suffix?: string
  label: string
}

function AnimatedCounter({ end, suffix = '', label }: CounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 1500
    const steps = 30
    const increment = end / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [end])

  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-isla-white mono">
        {count}{suffix}
      </div>
      <div className="text-xs text-isla-muted mt-0.5">{label}</div>
    </div>
  )
}

const stats = [
  { end: 4, suffix: '', label: 'tenants seeded' },
  { end: 17, suffix: '', label: 'documents protected' },
  { end: 142, suffix: '+', label: 'audit events recorded' },
  { end: 5, suffix: '', label: 'attack simulations' },
  { end: 0, suffix: '', label: 'trusted client org IDs' },
]

export function SecurityProofStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-card-static px-8 py-6 grid grid-cols-5 gap-4"
    >
      {stats.map((stat) => (
        <AnimatedCounter key={stat.label} {...stat} />
      ))}
    </motion.div>
  )
}

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle } from 'lucide-react'
import type { SimulationResult } from '@/lib/types'

interface SecurityLabCardProps {
  title: string
  description: string
  type: string
  intent: string
}

export function SecurityLabCard({ title, description, type, intent }: SecurityLabCardProps) {
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/security-lab/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Simulation failed')
      }

      const data: SimulationResult = await res.json()
      setResult(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const isBlocked = result?.result === 'BLOCKED'

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-sm text-isla-white">{title}</h3>
          {result && (
            <Badge variant={isBlocked ? 'blocked' : 'audit'}>
              {result.result}
            </Badge>
          )}
        </div>
        <p className="text-xs text-isla-muted mb-3">{description}</p>

        <button
          onClick={run}
          disabled={loading}
          className={cn(
            'px-4 py-1.5 rounded-lg text-xs font-medium transition-all',
            'bg-isla-amethyst text-white hover:bg-isla-amethyst/90',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {loading ? 'Running...' : '▶ Run Simulation'}
        </button>

        {error && (
          <p className="mt-3 text-xs text-isla-danger">{error}</p>
        )}

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-1 overflow-hidden"
            >
              <div className="text-xs text-isla-muted mb-2 mono">Intent: {intent}</div>

              {result.steps.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.2 }}
                  className={cn(
                    'flex items-start gap-2 py-1 px-2 rounded text-xs',
                    step.passed ? 'bg-isla-success/5' : 'bg-isla-danger/5',
                  )}
                >
                  <span className={step.passed ? 'text-isla-success' : 'text-isla-danger'}>
                    {step.passed ? '✓' : '✗'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className={cn('font-medium', step.passed ? 'text-isla-success' : 'text-isla-danger')}>
                      {step.label}
                    </div>
                    <div className="text-isla-muted mono text-[11px] break-all">{step.detail}</div>
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + result.steps.length * 0.08, duration: 0.3 }}
                className="pt-2 mt-2 border-t border-isla-border space-y-1 text-xs mono"
              >
                <div className="flex justify-between">
                  <span className="text-isla-muted">Response</span>
                  <span className={result.responseCode >= 400 ? 'text-isla-danger' : 'text-isla-success'}>
                    {result.responseCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-isla-muted">Audit Event</span>
                  <span className="text-isla-success">{result.auditEvent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-isla-muted">Recorded</span>
                  <span className={result.auditRecorded ? 'text-isla-success' : 'text-isla-danger'}>
                    {result.auditRecorded ? <CheckCircle className="inline w-3.5 h-3.5" /> : <XCircle className="inline w-3.5 h-3.5" />}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

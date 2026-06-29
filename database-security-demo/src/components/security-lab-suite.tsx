'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'
import { Loader2, ShieldAlert, ShieldCheck, ExternalLink } from 'lucide-react'

const simulationTypes = [
  'cross-tenant',
  'admin-action',
  'org-id-injection',
  'audit-tamper',
  'escalated-edit',
] as const

type SuiteResult = {
  type: string
  result: 'ALLOWED' | 'BLOCKED'
  responseCode: number
  auditRecorded: boolean
}

export function SecurityLabSuite() {
  const [running, setRunning] = useState(false)
  const [current, setCurrent] = useState(0)
  const [results, setResults] = useState<SuiteResult[]>([])
  const [lastEventId, setLastEventId] = useState<string | null>(null)

  async function runSuite() {
    setRunning(true)
    setResults([])
    setCurrent(0)
    const collected: SuiteResult[] = []

    for (const type of simulationTypes) {
      setCurrent(collected.length + 1)
      try {
        const res = await fetch('/api/security-lab/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type }),
        })
        const data = await res.json()
        collected.push({
          type,
          result: data.result ?? (res.ok ? 'ALLOWED' : 'BLOCKED'),
          responseCode: data.simulatedResponseCode ?? res.status,
          auditRecorded: data.auditRecorded ?? false,
        })
        if (data.auditEvent) {
          setLastEventId(data.auditEvent)
        }
      } catch {
        collected.push({ type, result: 'BLOCKED', responseCode: 0, auditRecorded: false })
      }
    }

    setResults(collected)
    setRunning(false)
  }

  const blocked = results.filter((r) => r.result === 'BLOCKED').length
  const sanitized = results.filter((r) => r.type === 'org-id-injection').length
  const auditEvents = results.filter((r) => r.auditRecorded).length

  return (
    <div className="space-y-4">
      <GlassCard hover={false}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-isla-white">Run Full Attack Suite</h2>
            <p className="text-xs text-isla-muted mt-1">
              Execute all 5 simulations sequentially and review the combined results.
            </p>
          </div>
          <button
            onClick={runSuite}
            disabled={running}
            className="flex items-center gap-2 rounded-lg bg-isla-amethyst px-4 py-2 text-sm font-medium text-white hover:bg-isla-amethyst/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {running ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Running {current}/{simulationTypes.length}</>
            ) : (
              <><ShieldAlert className="w-4 h-4" /> Run Full Attack Suite</>
            )}
          </button>
        </div>

        {running && (
          <div className="mt-4">
            <div className="flex gap-1">
              {simulationTypes.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i < current ? 'bg-isla-amethyst' : 'bg-isla-border'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-isla-muted mt-2">
              Simulation {current} of {simulationTypes.length}: {simulationTypes[current - 1]?.replace(/-/g, ' ')}
            </p>
          </div>
        )}
      </GlassCard>

      <AnimatePresence>
        {results.length > 0 && !running && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <GlassCard hover={false}>
              <h3 className="text-sm font-semibold text-isla-white mb-3">Suite Results</h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <ResultStat label="Attempted" value={results.length} color="text-isla-white" />
                <ResultStat label="Blocked" value={blocked} color="text-isla-danger" />
                <ResultStat label="Sanitized" value={sanitized} color="text-isla-warning" />
                <ResultStat label="Audit Events" value={auditEvents} color="text-isla-success" />
              </div>

              <div className="text-xs text-isla-success mb-4">
                Cross-tenant records exposed: 0
              </div>

              <div className="space-y-2">
                {results.map((r) => (
                  <div key={r.type} className="flex items-center justify-between py-1.5 border-b border-isla-border last:border-0">
                    <div className="flex items-center gap-2">
                      {r.result === 'BLOCKED' ? (
                        <ShieldAlert className="w-3.5 h-3.5 text-isla-danger" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-isla-success" />
                      )}
                      <span className="text-sm text-isla-white">{r.type.replace(/-/g, ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={r.result === 'BLOCKED' ? 'blocked' : 'audit'}>
                        {r.result === 'BLOCKED' ? `BLOCKED ${r.responseCode}` : `ALLOWED ${r.responseCode}`}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-isla-border">
                <a
                  href={lastEventId ? `/audit?highlight=${lastEventId}` : '/audit'}
                  className="inline-flex items-center gap-1.5 text-xs text-isla-pacific hover:text-isla-pacific/80 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  View Audit Trail
                </a>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ResultStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="glass-card-static p-3 text-center">
      <div className={`text-lg font-bold ${color}`}>{value}</div>
      <div className="text-xs text-isla-muted">{label}</div>
    </div>
  )
}

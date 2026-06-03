'use client'

import { useEffect, useState } from 'react'
import type { FunnelResult } from '@/lib/analytics/funnels'

type FunnelResponse = FunnelResult & { recommendations: unknown[] }

export default function FunnelsPage() {
  const [contact, setContact] = useState<FunnelResponse | null>(null)
  const [audit, setAudit] = useState<FunnelResponse | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/analytics/funnel?funnel=contact&range=7d').then(r => r.json()),
      fetch('/api/analytics/funnel?funnel=audit&range=7d').then(r => r.json()),
    ]).then(([c, a]) => { setContact(c); setAudit(a) })
  }, [])

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-semibold text-text-primary">Funnel Comparison</h1>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border-subtle text-xs uppercase text-text-tertiary">
            <th className="pb-2 font-medium">Funnel</th>
            <th className="pb-2 font-medium">Landings</th>
            <th className="pb-2 font-medium">Engaged</th>
            <th className="pb-2 font-medium">Intent</th>
            <th className="pb-2 font-medium">Form Start</th>
            <th className="pb-2 font-medium">Success</th>
            <th className="pb-2 font-medium">CVR</th>
            <th className="pb-2 font-medium">Drop-off</th>
          </tr>
        </thead>
        <tbody>
          {[contact, audit].filter(Boolean).map((d) => {
            if (!d) return null
            return (
              <tr key={d.funnel} className="border-b border-border-subtle">
                <td className="py-3 font-medium capitalize text-text-primary">{d.funnel}</td>
                <td className="py-3 text-text-secondary">{d.landings}</td>
                <td className="py-3 text-text-secondary">{d.engaged}</td>
                <td className="py-3 text-text-secondary">{d.intent}</td>
                <td className="py-3 text-text-secondary">{d.form_start}</td>
                <td className="py-3 text-text-secondary">{d.success}</td>
                <td className="py-3 font-medium text-text-primary">{(d.conversion_rate * 100).toFixed(1)}%</td>
                <td className="py-3 text-xs text-red-500">{d.dropoff_stage}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {!contact && !audit && <p className="mt-4 text-sm text-text-tertiary">Loading…</p>}
    </div>
  )
}

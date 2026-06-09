'use client'

import { useEffect, useState } from 'react'
import type { FunnelResult, Recommendation } from '@/lib/analytics/funnels'

type FunnelResponse = FunnelResult & { recommendations: Recommendation[] }

export function FunnelOverview() {
  const [contact, setContact] = useState<FunnelResponse | null>(null)
  const [audit, setAudit] = useState<FunnelResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/analytics/funnel?funnel=contact&range=7d').then(r => r.json()),
      fetch('/api/analytics/funnel?funnel=audit&range=7d').then(r => r.json()),
    ])
      .then(([c, a]) => {
        if (c.error) { setError(c.error); return }
        setContact(c)
        setAudit(a)
      })
      .catch(e => setError(e.message))
  }, [])

  if (error) {
    return (
      <div className="rounded-lg border border-border-subtle bg-bg-surface p-6">
        <p className="text-sm text-red-500">{error}</p>
        <p className="mt-2 text-xs text-text-tertiary">Set POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID to enable.</p>
      </div>
    )
  }

  if (!contact || !audit) {
    return <p className="text-sm text-text-tertiary">Loading funnel data…</p>
  }

  return (
    <div className="space-y-8">
      <FunnelCard title="Contact Funnel (7d)" data={contact} />
      <FunnelCard title="Audit Funnel (7d)" data={audit} />
    </div>
  )
}

function FunnelCard({ title, data }: { title: string; data: FunnelResponse }) {
  const pct = (v: number) => (v * 100).toFixed(1)

  return (
    <div className="rounded-lg border border-border-subtle bg-bg-surface p-6">
      <h2 className="mb-4 text-lg font-medium text-text-primary">{title}</h2>

      <div className="mb-4 grid grid-cols-6 gap-4 text-center text-sm">
        <Metric label="Landings" value={data.landings} />
        <Metric label="Engaged" value={data.engaged} />
        <Metric label="Intent" value={data.intent} />
        <Metric label="Form Start" value={data.form_start} />
        <Metric label="Success" value={data.success} />
        <Metric label="CVR" value={`${pct(data.conversion_rate)}%`} />
      </div>

      <DropoffBar data={data} />

      {data.recommendations.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wide text-text-tertiary">Recommendations</h3>
          {data.recommendations.map((r, i) => (
            <div key={i} className={`rounded px-3 py-2 text-xs ${r.severity === 'high' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
              <span className="font-medium">{r.issue}</span>: {r.action}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-lg font-semibold text-text-primary">{value}</div>
      <div className="text-xs text-text-tertiary">{label}</div>
    </div>
  )
}

function DropoffBar({ data }: { data: FunnelResult }) {
  if (data.landings === 0) return null

  const stages = [
    { label: 'Landing', count: data.landings },
    { label: 'Engaged', count: data.engaged },
    { label: 'Intent', count: data.intent },
    ...(data.funnel === 'contact' ? [{ label: 'Form Start', count: data.form_start }] : []),
    { label: 'Success', count: data.success },
  ]

  const maxCount = Math.max(...stages.map(s => s.count), 1)

  return (
    <div className="space-y-1.5">
      {stages.map(s => (
        <div key={s.label} className="flex items-center gap-3 text-xs">
          <span className="w-20 text-right text-text-secondary">{s.label}</span>
          <div className="h-4 flex-1 rounded bg-gray-100">
            <div
              className="h-full rounded bg-blue-500 transition-[height]"
              style={{ width: `${(s.count / maxCount) * 100}%` }}
            />
          </div>
          <span className="w-12 text-left text-text-secondary">{s.count}</span>
        </div>
      ))}
    </div>
  )
}

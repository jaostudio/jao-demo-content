'use client'

import { useEffect, useState } from 'react'
import type { FunnelResult } from '@/lib/analytics/funnels'

export default function DevicesPage() {
  const [mobile, setMobile] = useState<FunnelResult | null>(null)
  const [desktop, setDesktop] = useState<FunnelResult | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/analytics/funnel?funnel=contact&range=7d&device=mobile').then(r => r.json()),
      fetch('/api/analytics/funnel?funnel=contact&range=7d&device=desktop').then(r => r.json()),
    ]).then(([m, d]) => { setMobile(m); setDesktop(d) })
  }, [])

  if (!mobile && !desktop) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <p className="text-sm text-text-tertiary">Loading device data…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-semibold text-text-primary">Device Split</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <DeviceCard title="Mobile" data={mobile} />
        <DeviceCard title="Desktop" data={desktop} />
      </div>
    </div>
  )
}

function DeviceCard({ title, data }: { title: string; data: FunnelResult | null }) {
  if (!data) return <div className="rounded-lg border border-border-subtle bg-bg-surface p-6"><p className="text-sm text-text-tertiary">No data</p></div>

  return (
    <div className="rounded-lg border border-border-subtle bg-bg-surface p-6">
      <h2 className="mb-4 text-lg font-medium text-text-primary">{title}</h2>
      <dl className="space-y-2 text-sm">
        <Row label="Landings" value={data.landings} />
        <Row label="Engaged" value={data.engaged} />
        <Row label="Intent" value={data.intent} />
        <Row label="Success" value={data.success} />
        <Row label="CVR" value={`${(data.conversion_rate * 100).toFixed(1)}%`} />
        <Row label="Drop-off" value={data.dropoff_stage} />
        <Row label="Intent Score" value={data.intent_score} />
      </dl>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between">
      <dt className="text-text-tertiary">{label}</dt>
      <dd className="font-medium text-text-primary">{value}</dd>
    </div>
  )
}

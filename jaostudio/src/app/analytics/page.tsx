import { FunnelOverview } from './funnel-overview'

export const metadata = { title: 'Analytics | JAOstudio', robots: { index: false } }

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">Analytics</h1>
        <p className="mt-1 text-sm text-text-secondary">Internal funnel dashboard - not publicly linked</p>
      </div>
      <FunnelOverview />
    </div>
  )
}

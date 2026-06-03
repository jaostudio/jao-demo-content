import { NextRequest } from 'next/server'
import { buildFunnelQuery, transformFunnelResult, generateRecommendations } from '@/lib/analytics/funnels'
import type { FunnelType } from '@/lib/analytics/funnels'

const POSTHOG_API_HOST = process.env.POSTHOG_API_HOST || 'https://us.posthog.com'
const PROJECT_ID = process.env.POSTHOG_PROJECT_ID || ''
const API_KEY = process.env.POSTHOG_PERSONAL_API_KEY || ''

function isValidFunnel(val: string | null): val is FunnelType {
  return val === 'contact' || val === 'audit'
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const funnelParam = searchParams.get('funnel') || 'contact'
  const funnel: FunnelType = isValidFunnel(funnelParam) ? funnelParam : 'contact'
  const range = searchParams.get('range') || '7d'
  const device = searchParams.get('device') || undefined

  if (!API_KEY || !PROJECT_ID) {
    return Response.json(
      { error: 'POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID must be set' },
      { status: 503 }
    )
  }

  const query = buildFunnelQuery(funnel, range, device)

  try {
    const res = await fetch(`${POSTHOG_API_HOST}/api/projects/${PROJECT_ID}/query/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
    })

    if (!res.ok) {
      const errBody = await res.text().catch(() => '')
      return Response.json(
        { error: `PostHog query failed (${res.status})`, detail: errBody },
        { status: 502 }
      )
    }

    const raw = await res.json()
    const result = transformFunnelResult(raw, funnel, device)
    const recommendations = generateRecommendations(result)

    return Response.json({ ...result, recommendations })
  } catch (err) {
    return Response.json(
      { error: 'Failed to query PostHog', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 }
    )
  }
}

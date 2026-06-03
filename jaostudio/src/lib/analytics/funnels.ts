export const FUNNEL_EVENTS = {
  contact: {
    landings: '$pageview',
    engaged: 'engaged',
    intent: 'cta_clicked',
    formStart: 'contact_form_started',
    success: 'contact_form_submitted',
  },
  audit: {
    landings: '$pageview',
    engaged: 'engaged',
    intent: 'audit_form_started',
    formStart: 'audit_form_started',
    success: 'audit_request_submitted',
  },
} as const

export type FunnelType = keyof typeof FUNNEL_EVENTS

export function buildFunnelQuery(funnel: FunnelType, range: string, device?: string): string {
  const events = FUNNEL_EVENTS[funnel]

  const eventNames = [events.landings, events.engaged, events.intent, events.formStart, events.success]
  const interval = range.endsWith('d') ? range.replace('d', ' DAY') : range

  const whereClauses = [
    `timestamp >= now() - INTERVAL ${interval}`,
    `properties.$session_id IS NOT NULL`,
    `event IN (${eventNames.map(n => `'${n}'`).join(', ')})`,
  ]

  if (device === 'mobile') {
    whereClauses.push(`properties.$device_type = 'Mobile'`)
  } else if (device === 'desktop') {
    whereClauses.push(`properties.$device_type = 'Desktop'`)
  }

  const filters = whereClauses.join('\n  AND ')

  return `
SELECT
  countIf(event = '${events.landings}') as landings,
  countIf(event = '${events.engaged}') as engaged,
  countIf(event = '${events.intent}') as intent,
  countIf(event = '${events.formStart}') as form_start,
  countIf(event = '${events.success}' AND properties.status = 'success') as success,
  (countIf(event = '${events.success}' AND properties.status = 'success')
    / greatest(countIf(event = '${events.landings}'), 1)) as conversion_rate,
  (countIf(event = '${events.intent}') * 2
    + countIf(event = '${events.formStart}') * 3
    + greatest(countIf(event = '${events.engaged}'), 0)) as intent_score
FROM events
WHERE ${filters}`
}

export interface FunnelResult {
  funnel: string
  landings: number
  engaged: number
  intent: number
  form_start: number
  success: number
  conversion_rate: number
  intent_score: number
  dropoff_stage: string
  device: string
}

export function transformFunnelResult(raw: any, funnel: string, device?: string): FunnelResult {
  const row = raw.results?.[0] ?? {}

  const landings = Number(row.landings) || 0
  const engaged = Number(row.engaged) || 0
  const intent = Number(row.intent) || 0
  const formStart = Number(row.form_start) || 0
  const success = Number(row.success) || 0

  let dropoff_stage = 'none'
  if (landings > 0 && engaged === 0) dropoff_stage = 'engaged'
  else if (engaged > 0 && intent === 0) dropoff_stage = 'intent'
  else if (intent > 0 && formStart === 0 && funnel === 'contact') dropoff_stage = 'form_start'
  else if (intent > 0 && success === 0) dropoff_stage = 'submit'

  return {
    funnel,
    landings,
    engaged,
    intent,
    form_start: formStart,
    success,
    conversion_rate: Number(row.conversion_rate) || 0,
    intent_score: Number(row.intent_score) || 0,
    dropoff_stage,
    device: device || 'all',
  }
}

export interface Recommendation {
  severity: 'high' | 'medium' | 'low'
  issue: string
  action: string
}

export function generateRecommendations(m: FunnelResult): Recommendation[] {
  const recs: Recommendation[] = []

  if (m.conversion_rate < 0.05 && m.landings > 20) {
    recs.push({
      severity: 'high',
      issue: 'Low conversion rate',
      action: 'Check CTA hierarchy and form friction',
    })
  }

  if (m.intent === 0 && m.engaged > Math.max(10, m.landings * 0.3)) {
    recs.push({
      severity: 'high',
      issue: 'Engagement without intent',
      action: 'CTA is not visible or not compelling',
    })
  }

  if (m.success === 0 && m.intent > 10) {
    recs.push({
      severity: 'high',
      issue: 'Intent not converting',
      action: 'Form UX or validation blocking submissions',
    })
  }

  if (m.dropoff_stage === 'engaged' && m.engaged > 20) {
    recs.push({
      severity: 'medium',
      issue: 'Users engage but do not reach a CTA',
      action: 'Review CTA placement and above-fold hierarchy',
    })
  }

  if (m.form_start > 0 && m.success === 0 && m.intent > 5) {
    recs.push({
      severity: 'high',
      issue: 'Users start forms but never submit',
      action: 'Reduce form fields or check validation errors',
    })
  }

  return recs
}

'use client'

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let sid = sessionStorage.getItem('as_session_id')
  if (!sid) {
    sid = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    sessionStorage.setItem('as_session_id', sid)
  }
  return sid
}

function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const stored = sessionStorage.getItem('as_utm')
  if (stored) return JSON.parse(stored)

  const params = new URLSearchParams(window.location.search)
  const utm: Record<string, string> = {}
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
    const val = params.get(key)
    if (val) utm[key] = val
  }

  const source = params.get('source')
  if (source && !utm.utm_source) utm.utm_source = source

  if (Object.keys(utm).length > 0) {
    sessionStorage.setItem('as_utm', JSON.stringify(utm))
  }
  return utm
}

function getFirstReferrer(): string {
  if (typeof window === 'undefined') return ''
  const stored = sessionStorage.getItem('as_referrer')
  if (stored) return stored
  const ref = document.referrer || ''
  if (ref) sessionStorage.setItem('as_referrer', ref)
  return ref
}

export function buildTrackingContext() {
  if (typeof window === 'undefined') return {}
  return {
    session_id: getSessionId(),
    ...getUtmParams(),
    referrer: getFirstReferrer(),
  }
}

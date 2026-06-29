const VALID_CONTENT_TYPES = ['application/json', 'application/x-www-form-urlencoded', 'multipart/form-data']

export function assertSameOrigin(headers: Headers): void {
  const origin = headers.get('origin')
  const host = headers.get('host')

  if (!host) return

  if (!origin) return

  try {
    const originHost = new URL(origin).host
    if (originHost !== host) {
      throw new Error('cross_origin_request_blocked')
    }
  } catch {
    throw new Error('cross_origin_request_blocked')
  }
}

export function getClientIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? headers.get('x-real-ip')
    ?? 'unknown'
}

export function assertJsonContentType(headers: Headers): void {
  const ct = headers.get('content-type') ?? ''
  if (!VALID_CONTENT_TYPES.some(t => ct.includes(t))) {
    throw new Error('Unsupported content type')
  }
}

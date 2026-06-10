const requestLog = new Map<string, number[]>()

const WINDOW_MS = 60_000
const MAX_REQUESTS = 5

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const timestamps = requestLog.get(ip) ?? []
  const recent = timestamps.filter((t) => now - t < WINDOW_MS)

  if (recent.length >= MAX_REQUESTS) {
    const oldest = recent[0]!
    return { allowed: false, remaining: 0, resetIn: WINDOW_MS - (now - oldest) }
  }

  recent.push(now)
  requestLog.set(ip, recent)
  return { allowed: true, remaining: MAX_REQUESTS - recent.length, resetIn: 0 }
}

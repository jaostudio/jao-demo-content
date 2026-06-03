import { headers } from 'next/headers'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  name: string
}

interface RateLimitEntry {
  count: number
  resetAt: number
}

const stores = new Map<string, Map<string, RateLimitEntry>>()

function getStore(name: string): Map<string, RateLimitEntry> {
  if (!stores.has(name)) {
    stores.set(name, new Map())
  }
  return stores.get(name)!
}

export async function rateLimit(config: RateLimitConfig): Promise<{
  success: boolean
  remaining: number
  resetAt: number
}> {
  const headerStore = await headers()
  const ip = headerStore.get('x-forwarded-for') ?? headerStore.get('x-real-ip') ?? 'unknown'
  const store = getStore(config.name)
  const key = `${ip}:${config.name}`
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowMs })
    return { success: true, remaining: config.maxRequests - 1, resetAt: now + config.windowMs }
  }

  if (entry.count >= config.maxRequests) {
    return { success: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { success: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt }
}

export function createRateLimiter(name: string, maxRequests = 10, windowMs = 60000) {
  return () => rateLimit({ name, maxRequests, windowMs })
}

export const rateLimiters = {
  api: createRateLimiter('api', 30, 60000),
  auth: createRateLimiter('auth', 5, 60000),
  upload: createRateLimiter('upload', 10, 60000),
  contact: createRateLimiter('contact', 3, 60000),
} as const

export function cleanupStaleEntries(): void {
  const now = Date.now()
  for (const [, store] of stores) {
    for (const [key, entry] of store) {
      if (now > entry.resetAt) {
        store.delete(key)
      }
    }
  }
}

if (typeof setInterval !== 'undefined') {
  setInterval(cleanupStaleEntries, 60000)
}

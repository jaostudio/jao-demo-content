import { memoryRateLimit } from './memory'
import { redisRateLimit } from './redis'

type RateLimitResult = { ok: boolean; remaining: number }

const redisAvailable = !!(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
)

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  if (redisAvailable) {
    try {
      const rl = redisRateLimit(limit, windowMs)
      const { success, remaining } = await rl.limit(key)
      return { ok: success, remaining }
    } catch {
      console.warn('[rate-limit] Redis unavailable, falling back to memory')
    }
  }

  return memoryRateLimit(key, limit, windowMs)
}

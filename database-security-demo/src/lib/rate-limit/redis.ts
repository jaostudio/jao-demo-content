import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let redis: Redis | null = null
let ratelimitInstance: Ratelimit | null = null

function getRedis() {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL ?? '',
      token: process.env.UPSTASH_REDIS_REST_TOKEN ?? '',
    })
  }
  return redis
}

export function redisRateLimit(limit: number, windowMs: number) {
  const windowSeconds = Math.max(1, Math.floor(windowMs / 1000))

  if (!ratelimitInstance) {
    ratelimitInstance = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
      analytics: true,
    })
  }

  return ratelimitInstance
}

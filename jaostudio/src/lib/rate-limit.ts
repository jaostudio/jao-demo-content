import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { createHash } from 'crypto'

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
const RATE_LIMIT_SALT = process.env.RATE_LIMIT_SALT || 'jaostudio-rl-salt'

function getClientIp(req: Request): string {
  const cfIp = req.headers.get('cf-connecting-ip')
  if (cfIp) return cfIp
  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return 'unknown'
}

function hashIp(ip: string): string {
  return createHash('sha256').update(ip + RATE_LIMIT_SALT).digest('hex')
}

let contactLimiter: Ratelimit | null = null
let auditLimiter: Ratelimit | null = null

function getContactLimiter(): Ratelimit | null {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null
  if (!contactLimiter) {
    const redis = new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN })
    contactLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '10 m'),
      prefix: 'rl:contact',
    })
  }
  return contactLimiter
}

function getAuditLimiter(): Ratelimit | null {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null
  if (!auditLimiter) {
    const redis = new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN })
    auditLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '10 m'),
      prefix: 'rl:audit',
    })
  }
  return auditLimiter
}

export interface RateLimitResult {
  ok: boolean
  limit: number
  remaining: number
  reset: number
}

export async function checkRateLimit(req: Request, type: 'contact' | 'audit'): Promise<RateLimitResult | null> {
  const ip = getClientIp(req)
  const identifier = hashIp(ip)

  const limiter = type === 'audit' ? getAuditLimiter() : getContactLimiter()
  if (!limiter) return null

  const result = await limiter.limit(identifier)
  return {
    ok: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  }
}

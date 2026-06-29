import { describe, it, expect } from 'vitest'
import { createHash } from 'node:crypto'
import { assertSameOrigin } from '@/lib/security/request-guards'
import { verifyAuditEvent } from '@/lib/audit/verify'

function mockHeaders(entries: Record<string, string>): Headers {
  return new Headers(entries)
}

describe('assertSameOrigin hardened', () => {
  it('accepts same-origin request', () => {
    const h = mockHeaders({ origin: 'https://example.com', host: 'example.com' })
    expect(() => assertSameOrigin(h)).not.toThrow()
  })

  it('rejects cross-origin request', () => {
    const h = mockHeaders({ origin: 'https://attacker.com', host: 'example.com' })
    expect(() => assertSameOrigin(h)).toThrow('cross_origin_request_blocked')
  })

  it('passes when origin is absent (server-side or some same-origin)', () => {
    const h = mockHeaders({ host: 'example.com' })
    expect(() => assertSameOrigin(h)).not.toThrow()
  })

  it('passes when host is absent', () => {
    const h = mockHeaders({ origin: 'https://example.com' })
    expect(() => assertSameOrigin(h)).not.toThrow()
  })
})

describe('verifyAuditEvent resilience', () => {
  it('returns UNVERIFIED for null event', () => {
    const result = verifyAuditEvent(null as any)
    expect(result).toBe('UNVERIFIED')
  })

  it('returns UNVERIFIED for undefined event', () => {
    const result = verifyAuditEvent(undefined as any)
    expect(result).toBe('UNVERIFIED')
  })

  it('returns UNVERIFIED for missing eventHash', () => {
    const result = verifyAuditEvent({ eventHash: null, canonicalPayload: '{}' })
    expect(result).toBe('UNVERIFIED')
  })

  it('returns UNVERIFIED for missing canonicalPayload', () => {
    const result = verifyAuditEvent({ eventHash: 'abc', canonicalPayload: null })
    expect(result).toBe('UNVERIFIED')
  })

  it('returns VERIFIED for valid hash', () => {
    const canonicalPayload = '{"action":"test"}'
    const previousHash = ''
    const eventHash = createHash('sha256').update(previousHash + canonicalPayload).digest('hex')
    const result = verifyAuditEvent({ eventHash, canonicalPayload, previousHash })
    expect(result).toBe('VERIFIED')
  })

  it('returns TAMPERED for mismatched hash', () => {
    const result = verifyAuditEvent({ eventHash: 'tampered', canonicalPayload: '{}', previousHash: '' })
    expect(result).toBe('TAMPERED')
  })
})

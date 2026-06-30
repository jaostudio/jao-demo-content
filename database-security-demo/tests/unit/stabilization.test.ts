import { describe, it, expect } from 'vitest'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
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

describe('data-plane consistency (static scan)', () => {
  const authPath = path.join(process.cwd(), 'src', 'lib', 'auth', 'auth.ts')
  const prismaPath = path.join(process.cwd(), 'src', 'lib', 'prisma.ts')
  const authSource = fs.readFileSync(authPath, 'utf-8')
  const prismaSource = fs.readFileSync(prismaPath, 'utf-8')

  it('auth.ts imports getPrisma, not global prisma', () => {
    expect(authSource).toMatch(/import\s*\{\s*getPrisma\s*\}\s*from\s*['"]\.\.\/prisma['"]/)
    expect(authSource).not.toMatch(/import\s*\{\s*prisma\s*\}\s*from\s*['"]\.\.\/prisma['"]/)
  })

  it('authorize() calls await getPrisma()', () => {
    const authorizeBlock = authSource.match(/authorize\(credentials.*?\)[\s\S]*?return \{.*?\n\s+\}/)
    expect(authorizeBlock).not.toBeNull()
    expect(authorizeBlock![0]).toContain('await getPrisma()')
    expect(authorizeBlock![0]).not.toContain('(prisma as any)')
  })

  it('jwt() callback uses getPrisma()', () => {
    const jwtBlock = authSource.match(/async jwt\(\{[\s\S]*?\}\s*\)[\s\S]*?return token/)
    expect(jwtBlock).not.toBeNull()
    expect(jwtBlock![0]).toContain('await getPrisma()')
  })

  it('prisma.ts exports realPrisma (deprecated) not prisma', () => {
    expect(prismaSource).toMatch(/export\s+const\s+realPrisma\s*=/)
    expect(prismaSource).not.toMatch(/export\s+const\s+prisma(?:\s*[^R]|$)/)
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

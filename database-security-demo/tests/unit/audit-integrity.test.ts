import { describe, it, expect } from 'vitest'
import { createHash } from 'node:crypto'
import { verifyAuditEvent } from '@/lib/audit/verify'
import { stableJson } from '@/lib/audit/stable-json'

function sha256(input: string): string {
  return createHash('sha256').update(input, 'utf-8').digest('hex')
}

function makeHash(previousHash: string | null, canonicalPayload: string): string {
  return sha256(`${previousHash ?? ''}${canonicalPayload}`)
}

describe('verifyAuditEvent', () => {
  it('VERIFIED when hash matches payload', () => {
    const payload = '{"action":"document.created","outcome":"SUCCESS"}'
    const hash = makeHash(null, payload)
    const result = verifyAuditEvent({ eventHash: hash, previousHash: null, canonicalPayload: payload })
    expect(result).toBe('VERIFIED')
  })

  it('TAMPERED when canonicalPayload changes', () => {
    const payload = '{"action":"document.created","outcome":"SUCCESS"}'
    const hash = makeHash(null, payload)
    const result = verifyAuditEvent({ eventHash: hash, previousHash: null, canonicalPayload: '{"action":"document.deleted"}' })
    expect(result).toBe('TAMPERED')
  })

  it('TAMPERED when eventHash changes', () => {
    const payload = '{"action":"document.created","outcome":"SUCCESS"}'
    const result = verifyAuditEvent({ eventHash: 'deadbeef', previousHash: null, canonicalPayload: payload })
    expect(result).toBe('TAMPERED')
  })

  it('UNVERIFIED when eventHash is null', () => {
    const result = verifyAuditEvent({ eventHash: null, previousHash: null, canonicalPayload: '{}' })
    expect(result).toBe('UNVERIFIED')
  })

  it('UNVERIFIED when canonicalPayload is null', () => {
    const result = verifyAuditEvent({ eventHash: 'abc', previousHash: null, canonicalPayload: null })
    expect(result).toBe('UNVERIFIED')
  })

  it('UNVERIFIED when both are null', () => {
    const result = verifyAuditEvent({ eventHash: null, previousHash: null, canonicalPayload: null })
    expect(result).toBe('UNVERIFIED')
  })

  it('UNVERIFIED when fields are undefined', () => {
    const result = verifyAuditEvent({})
    expect(result).toBe('UNVERIFIED')
  })
})

describe('stableJson', () => {
  it('is deterministic', () => {
    const data = { a: 1, b: 2 }
    expect(stableJson(data)).toBe(stableJson(data))
  })

  it('sorts object keys', () => {
    const result = stableJson({ b: 1, a: 2, c: 3 })
    // Keys should be: a, b, c
    expect(result).toBe('{"a":2,"b":1,"c":3}')
  })

  it('converts undefined to null', () => {
    const result = stableJson({ x: undefined })
    expect(result).toBe('{"x":null}')
  })

  it('sorts nested object keys recursively', () => {
    const data = {
      meta: { z: 3, a: 1 },
      name: 'test',
    }
    const result = stableJson(data)
    // Top-level keys sorted: meta, name
    // Nested keys in meta sorted: a, z
    expect(result).toContain('"a":1')
    expect(result).toContain('"z":3')
    expect(result.indexOf('"meta"')).toBeLessThan(result.indexOf('"name"'))
  })
})

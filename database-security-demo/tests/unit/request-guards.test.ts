import { describe, it, expect } from 'vitest'
import { assertSameOrigin, assertJsonContentType } from '@/lib/security/request-guards'

function mockHeaders(entries: Record<string, string>): Headers {
  return new Headers(entries)
}

describe('assertSameOrigin', () => {
  it('passes when origin matches host', () => {
    const h = mockHeaders({ origin: 'https://example.com', host: 'example.com' })
    expect(() => assertSameOrigin(h)).not.toThrow()
  })

  it('passes when origin matches host with port', () => {
    const h = mockHeaders({ origin: 'https://example.com:3000', host: 'example.com:3000' })
    expect(() => assertSameOrigin(h)).not.toThrow()
  })

  it('throws when origin does not match host', () => {
    const h = mockHeaders({ origin: 'https://attacker.com', host: 'example.com' })
    expect(() => assertSameOrigin(h)).toThrow('cross_origin_request_blocked')
  })

  it('passes when origin is missing (non-browser request)', () => {
    const h = mockHeaders({ host: 'example.com' })
    expect(() => assertSameOrigin(h)).not.toThrow()
  })

  it('passes when host is missing', () => {
    const h = mockHeaders({ origin: 'https://example.com' })
    expect(() => assertSameOrigin(h)).not.toThrow()
  })

  it('throws on invalid origin URL', () => {
    const h = mockHeaders({ origin: 'not-a-url', host: 'example.com' })
    expect(() => assertSameOrigin(h)).toThrow('cross_origin_request_blocked')
  })
})

describe('assertJsonContentType', () => {
  it('passes for application/json', () => {
    const h = mockHeaders({ 'content-type': 'application/json' })
    expect(() => assertJsonContentType(h)).not.toThrow()
  })

  it('passes for multipart/form-data', () => {
    const h = mockHeaders({ 'content-type': 'multipart/form-data; boundary=xxx' })
    expect(() => assertJsonContentType(h)).not.toThrow()
  })

  it('throws for unsupported content type', () => {
    const h = mockHeaders({ 'content-type': 'text/plain' })
    expect(() => assertJsonContentType(h)).toThrow('Unsupported content type')
  })

  it('throws for missing content-type', () => {
    const h = mockHeaders({})
    expect(() => assertJsonContentType(h)).toThrow('Unsupported content type')
  })
})

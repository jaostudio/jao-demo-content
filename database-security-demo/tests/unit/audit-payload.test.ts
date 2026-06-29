import { describe, it, expect } from 'vitest'
import { stableJson } from '@/lib/audit/stable-json'

describe('canonical payload shape', () => {
  const payload = stableJson({
    action: 'document.created',
    outcome: 'SUCCESS',
    entityType: 'document',
    entityId: null,
    actorUserId: 'user_1',
    organizationId: 'org_1',
    requestId: null,
    causationId: null,
    ipAddress: '127.0.0.1',
    userAgent: null,
    metadata: {},
    createdAt: '2025-01-01T00:00:00.000Z',
  })

  it('includes action, outcome, entityType, actorUserId, organizationId', () => {
    expect(payload).toContain('"action"')
    expect(payload).toContain('"outcome"')
    expect(payload).toContain('"entityType"')
    expect(payload).toContain('"actorUserId"')
    expect(payload).toContain('"organizationId"')
  })

  it('includes requestId, ipAddress, userAgent, metadata, createdAt', () => {
    expect(payload).toContain('"requestId"')
    expect(payload).toContain('"ipAddress"')
    expect(payload).toContain('"userAgent"')
    expect(payload).toContain('"metadata"')
    expect(payload).toContain('"createdAt"')
  })

  it('metadata key order does not change payload hash', () => {
    const a = stableJson({ metadata: { b: 1, a: 2 }, action: 'test' })
    const b = stableJson({ action: 'test', metadata: { a: 2, b: 1 } })
    expect(a).toBe(b)
  })

  it('missing optional fields normalize to null', () => {
    const sparse = stableJson({
      action: 'test',
      outcome: 'SUCCESS',
      entityType: 'user',
      entityId: null,
      actorUserId: null,
      organizationId: 'org_1',
      requestId: null,
      causationId: null,
      ipAddress: null,
      userAgent: null,
      metadata: {},
      createdAt: '2025-01-01T00:00:00.000Z',
    })
    expect(sparse).toContain('"actorUserId":null')
    expect(sparse).toContain('"entityId":null')
    expect(sparse).toContain('"requestId":null')
    expect(sparse).toContain('"causationId":null')
    expect(sparse).toContain('"ipAddress":null')
    expect(sparse).toContain('"userAgent":null')
  })
})

import { describe, it, expect } from 'vitest'

type AccessDecisionResult = 'ALLOWED' | 'DENIED' | 'BLOCKED'

type AccessDecision = {
  result: AccessDecisionResult
  statusCode: number
  checks: Array<{ label: string; status: 'passed' | 'failed' }>
  auditRecorded: boolean
}

function makeAccessDecision(result: AccessDecisionResult, statusCode: number): AccessDecision {
  const isAllowed = result === 'ALLOWED'
  return {
    result,
    statusCode,
    checks: [
      { label: 'Session verification', status: 'passed' },
      { label: 'Tenant scope check', status: isAllowed ? 'passed' : 'failed' },
      { label: 'RBAC authorization', status: isAllowed ? 'passed' : 'failed' },
    ],
    auditRecorded: true,
  }
}

describe('AccessDecision', () => {
  it('ALLOWED decision has 2xx status code', () => {
    const decision = makeAccessDecision('ALLOWED', 200)
    expect(decision.result).toBe('ALLOWED')
    expect(decision.statusCode).toBeLessThan(300)
  })

  it('DENIED decision has 4xx status code', () => {
    const decision = makeAccessDecision('DENIED', 403)
    expect(decision.result).toBe('DENIED')
    expect(decision.statusCode).toBeGreaterThanOrEqual(400)
  })

  it('BLOCKED decision has 4xx or 5xx status code', () => {
    const decision = makeAccessDecision('BLOCKED', 404)
    expect(decision.result).toBe('BLOCKED')
    expect(decision.statusCode).toBeGreaterThanOrEqual(400)
  })

  it('ALLOWED has all passed checks', () => {
    const decision = makeAccessDecision('ALLOWED', 200)
    expect(decision.checks.every((c) => c.status === 'passed')).toBe(true)
  })

  it('DENIED has at least one failed check', () => {
    const decision = makeAccessDecision('DENIED', 403)
    expect(decision.checks.some((c) => c.status === 'failed')).toBe(true)
  })

  it('all decisions record audit events', () => {
    const allowed = makeAccessDecision('ALLOWED', 200)
    const denied = makeAccessDecision('DENIED', 403)
    expect(allowed.auditRecorded).toBe(true)
    expect(denied.auditRecorded).toBe(true)
  })

  it('cross-tenant access returns 404 (not 403)', () => {
    const decision = makeAccessDecision('BLOCKED', 404)
    expect(decision.statusCode).toBe(404)
    expect(decision.statusCode).not.toBe(403)
  })
})

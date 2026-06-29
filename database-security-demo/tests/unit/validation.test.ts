import { describe, it, expect } from 'vitest'
import {
  registerSchema,
  documentCreateSchema,
  securityLabSimulationSchema,
  adminCreateUserSchema,
  adminCreateOrgSchema,
} from '@/lib/validation'

describe('registerSchema', () => {
  it('accepts valid registration', () => {
    const r = registerSchema.safeParse({ name: 'Test', email: 'test@example.com', password: 'password123' })
    expect(r.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const r = registerSchema.safeParse({ name: 'Test', email: 'not-an-email', password: 'password123' })
    expect(r.success).toBe(false)
  })

  it('rejects short password', () => {
    const r = registerSchema.safeParse({ name: 'Test', email: 'test@example.com', password: 'short' })
    expect(r.success).toBe(false)
  })

  it('rejects empty name', () => {
    const r = registerSchema.safeParse({ name: '', email: 'test@example.com', password: 'password123' })
    expect(r.success).toBe(false)
  })
})

describe('documentCreateSchema', () => {
  it('accepts valid document', () => {
    const r = documentCreateSchema.safeParse({ title: 'Doc Title', body: 'Content here' })
    expect(r.success).toBe(true)
  })

  it('rejects empty title', () => {
    const r = documentCreateSchema.safeParse({ title: '', body: 'Content' })
    expect(r.success).toBe(false)
  })

  it('rejects empty body', () => {
    const r = documentCreateSchema.safeParse({ title: 'Title', body: '' })
    expect(r.success).toBe(false)
  })

  it('rejects oversized body', () => {
    const r = documentCreateSchema.safeParse({ title: 'Title', body: 'x'.repeat(10001) })
    expect(r.success).toBe(false)
  })
})

describe('securityLabSimulationSchema', () => {
  it('accepts valid simulation types', () => {
    for (const type of ['cross-tenant', 'admin-action', 'org-id-injection', 'audit-tamper', 'escalated-edit'] as const) {
      const r = securityLabSimulationSchema.safeParse({ type })
      expect(r.success).toBe(true)
    }
  })

  it('rejects unknown simulation type', () => {
    const r = securityLabSimulationSchema.safeParse({ type: 'invalid-type' })
    expect(r.success).toBe(false)
  })

  it('rejects missing type', () => {
    const r = securityLabSimulationSchema.safeParse({})
    expect(r.success).toBe(false)
  })
})

describe('adminCreateUserSchema', () => {
  it('accepts valid user data', () => {
    const r = adminCreateUserSchema.safeParse({ name: 'New User', email: 'new@example.com', role: 'ORG_USER' })
    expect(r.success).toBe(true)
  })

  it('accepts user with orgId', () => {
    const r = adminCreateUserSchema.safeParse({ name: 'New User', email: 'new@example.com', role: 'ORG_ADMIN', orgId: 'org_123' })
    expect(r.success).toBe(true)
  })

  it('rejects invalid role', () => {
    const r = adminCreateUserSchema.safeParse({ name: 'New User', email: 'new@example.com', role: 'INVALID' })
    expect(r.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const r = adminCreateUserSchema.safeParse({ name: 'New User', email: 'bad', role: 'ORG_USER' })
    expect(r.success).toBe(false)
  })
})

describe('adminCreateOrgSchema', () => {
  it('accepts valid org name', () => {
    const r = adminCreateOrgSchema.safeParse({ name: 'New Organization' })
    expect(r.success).toBe(true)
  })

  it('rejects empty name', () => {
    const r = adminCreateOrgSchema.safeParse({ name: '' })
    expect(r.success).toBe(false)
  })
})

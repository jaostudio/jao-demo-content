import { describe, it, expect } from 'vitest'
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '../../src/lib/demo-accounts'

describe('DEMO_ACCOUNTS', () => {
  it('has exactly 4 accounts', () => {
    expect(DEMO_ACCOUNTS).toHaveLength(4)
  })

  it('emails are in canonical order and cannot drift from seed', () => {
    expect(DEMO_ACCOUNTS.map((a) => a.email)).toEqual([
      'jao@luntian.demo',
      'gina@talapay.demo',
      'kiko@bayani.demo',
      'grace@pulodata.demo',
    ])
  })

  it('password is password123', () => {
    expect(DEMO_PASSWORD).toBe('password123')
  })

  it('each account has required fields', () => {
    for (const account of DEMO_ACCOUNTS) {
      expect(account.name).toBeTruthy()
      expect(account.email).toMatch(/^.+@.+\.demo$/)
      expect(['ORG_ADMIN', 'ORG_USER', 'SYSTEM_ADMIN']).toContain(account.role)
      expect(account.tenant).toBeTruthy()
      expect(account.access).toBeTruthy()
    }
  })

  it('has exactly one SYSTEM_ADMIN', () => {
    const admins = DEMO_ACCOUNTS.filter((a) => a.role === 'SYSTEM_ADMIN')
    expect(admins).toHaveLength(1)
    expect(admins[0].email).toBe('grace@pulodata.demo')
  })
})

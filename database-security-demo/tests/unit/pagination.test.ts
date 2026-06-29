import { describe, it, expect } from 'vitest'
import { parseAuditLimit, buildAuditNextHref } from '@/lib/pagination/audit-pagination'

describe('parseAuditLimit', () => {
  it('undefined limit returns 50', () => {
    expect(parseAuditLimit(undefined)).toBe(50)
  })

  it('invalid limit returns 50', () => {
    expect(parseAuditLimit('abc')).toBe(50)
  })

  it('limit=25 returns 25', () => {
    expect(parseAuditLimit('25')).toBe(25)
  })

  it('limit=999 caps at 100', () => {
    expect(parseAuditLimit('999')).toBe(100)
  })

  it('limit=0 returns 50', () => {
    expect(parseAuditLimit('0')).toBe(50)
  })

  it('limit=-1 returns 50', () => {
    expect(parseAuditLimit('-1')).toBe(50)
  })
})

describe('buildAuditNextHref', () => {
  it('includes before and limit params', () => {
    const href = buildAuditNextHref('cursor_abc', 25)
    expect(href).toContain('before=cursor_abc')
    expect(href).toContain('limit=25')
  })
})

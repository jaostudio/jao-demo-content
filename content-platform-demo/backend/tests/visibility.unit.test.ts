import { describe, it, expect } from 'vitest'
import { canViewArticle, canEngageWithArticle } from '../src/lib/visibility'

function article(status: string, authorId = 'author-1') {
  return { status, authorId }
}

const user = (id: string, role: string) => ({ id, role })

describe('canViewArticle', () => {
  it('allows anyone to view PUBLISHED article', () => {
    expect(canViewArticle({ article: article('PUBLISHED') })).toBe(true)
    expect(canViewArticle({ article: article('PUBLISHED'), user: null })).toBe(true)
    expect(canViewArticle({ article: article('PUBLISHED'), user: user('other', 'AUTHOR') })).toBe(true)
  })

  it('blocks anonymous for DRAFT', () => {
    expect(canViewArticle({ article: article('DRAFT') })).toBe(false)
    expect(canViewArticle({ article: article('DRAFT'), user: null })).toBe(false)
  })

  it('allows owner to view DRAFT', () => {
    expect(canViewArticle({ article: article('DRAFT', 'owner-1'), user: user('owner-1', 'AUTHOR') })).toBe(true)
  })

  it('blocks non-owner AUTHOR for DRAFT', () => {
    expect(canViewArticle({ article: article('DRAFT', 'owner-1'), user: user('other', 'AUTHOR') })).toBe(false)
  })

  it('allows ADMIN to view DRAFT', () => {
    expect(canViewArticle({ article: article('DRAFT', 'owner-1'), user: user('admin-1', 'ADMIN') })).toBe(true)
  })

  it('allows owner to view PENDING_REVIEW', () => {
    expect(canViewArticle({ article: article('PENDING_REVIEW', 'owner-1'), user: user('owner-1', 'AUTHOR') })).toBe(true)
  })

  it('blocks non-owner for PENDING_REVIEW', () => {
    expect(canViewArticle({ article: article('PENDING_REVIEW', 'owner-1'), user: user('other', 'AUTHOR') })).toBe(false)
  })

  it('allows ADMIN to view PENDING_REVIEW', () => {
    expect(canViewArticle({ article: article('PENDING_REVIEW', 'owner-1'), user: user('admin-1', 'ADMIN') })).toBe(true)
  })

  it('allows owner to view ARCHIVED', () => {
    expect(canViewArticle({ article: article('ARCHIVED', 'owner-1'), user: user('owner-1', 'AUTHOR') })).toBe(true)
  })

  it('allows ADMIN to view ARCHIVED', () => {
    expect(canViewArticle({ article: article('ARCHIVED', 'owner-1'), user: user('admin-1', 'ADMIN') })).toBe(true)
  })

  it('blocks anonymous for ARCHIVED', () => {
    expect(canViewArticle({ article: article('ARCHIVED', 'owner-1') })).toBe(false)
  })
})

describe('canEngageWithArticle', () => {
  it('allows PUBLISHED', () => {
    expect(canEngageWithArticle(article('PUBLISHED'))).toBe(true)
  })

  it('blocks DRAFT', () => {
    expect(canEngageWithArticle(article('DRAFT'))).toBe(false)
  })

  it('blocks PENDING_REVIEW', () => {
    expect(canEngageWithArticle(article('PENDING_REVIEW'))).toBe(false)
  })

  it('blocks ARCHIVED', () => {
    expect(canEngageWithArticle(article('ARCHIVED'))).toBe(false)
  })
})

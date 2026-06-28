import { describe, it, expect, beforeAll } from 'vitest'
import { createTestApp, authedRequest, publicRequest, getFixtures, getTokenFor, postJson } from './helpers'

let app: ReturnType<typeof createTestApp>
let S: Record<string, { id: string; role: string; name: string; email: string }>
let PUBLISHED: { id: string }
let DRAFT: { id: string }
let PENDING: { id: string }
let ARCHIVED: { id: string }

beforeAll(async () => {
  app = createTestApp()
  const f = await getFixtures()
  S = f.authors
  PUBLISHED = f.articles.letterpress
  DRAFT = f.articles.brandDraft
  PENDING = f.articles.photographyPending
  ARCHIVED = f.articles.archivedPortfolio
})

describe('GET /api/articles/:id/comments', () => {
  it('returns comments for PUBLISHED article', async () => {
    const res = await publicRequest(app, `/api/articles/${PUBLISHED.id}/comments`)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
  })

  it('blocks anonymous for DRAFT article comments', async () => {
    const res = await publicRequest(app, `/api/articles/${DRAFT.id}/comments`)
    expect(res.status).toBe(404)
  })

  it('allows owner to view DRAFT article comments', async () => {
    const token = getTokenFor(S.sarah.id, S.sarah.role, S.sarah.name, S.sarah.email)
    const res = await authedRequest(app, `/api/articles/${DRAFT.id}/comments`, token)
    expect(res.status).toBe(200)
  })

  it('allows ADMIN to view DRAFT article comments', async () => {
    const token = getTokenFor(S.admin.id, S.admin.role, S.admin.name, S.admin.email)
    const res = await authedRequest(app, `/api/articles/${DRAFT.id}/comments`, token)
    expect(res.status).toBe(200)
  })

  it('blocks non-owner AUTHOR for DRAFT comments', async () => {
    const token = getTokenFor(S.marcus.id, S.marcus.role, S.marcus.name, S.marcus.email)
    const res = await authedRequest(app, `/api/articles/${DRAFT.id}/comments`, token)
    expect(res.status).toBe(404)
  })

  it('blocks non-owner for PENDING_REVIEW comments', async () => {
    const token = getTokenFor(S.sarah.id, S.sarah.role, S.sarah.name, S.sarah.email)
    const res = await authedRequest(app, `/api/articles/${PENDING.id}/comments`, token)
    expect(res.status).toBe(404)
  })

  it('allows owner for PENDING_REVIEW comments', async () => {
    const token = getTokenFor(S.marcus.id, S.marcus.role, S.marcus.name, S.marcus.email)
    const res = await authedRequest(app, `/api/articles/${PENDING.id}/comments`, token)
    expect(res.status).toBe(200)
  })
})

describe('POST /api/articles/:id/like', () => {
  it('allows like on PUBLISHED article', async () => {
    const res = await postJson(app, `/api/articles/${PUBLISHED.id}/like`, { action: 'like' })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('likes')
  })

  it('blocks like on DRAFT article', async () => {
    const res = await postJson(app, `/api/articles/${DRAFT.id}/like`, { action: 'like' })
    expect(res.status).toBe(404)
  })

  it('blocks like on PENDING_REVIEW article', async () => {
    const res = await postJson(app, `/api/articles/${PENDING.id}/like`, { action: 'like' })
    expect(res.status).toBe(404)
  })

  it('blocks like on ARCHIVED article', async () => {
    const res = await postJson(app, `/api/articles/${ARCHIVED.id}/like`, { action: 'like' })
    expect(res.status).toBe(404)
  })
})

describe('POST /api/articles/:id/collect', () => {
  it('allows collect on PUBLISHED article', async () => {
    const token = getTokenFor(S.marcus.id, S.marcus.role, S.marcus.name, S.marcus.email)
    const res = await authedRequest(app, `/api/articles/${PUBLISHED.id}/collect`, token, {
      method: 'POST',
    })
    expect([201, 200]).toContain(res.status)
  })

  it('blocks collect on DRAFT article', async () => {
    const token = getTokenFor(S.marcus.id, S.marcus.role, S.marcus.name, S.marcus.email)
    const res = await authedRequest(app, `/api/articles/${DRAFT.id}/collect`, token, {
      method: 'POST',
    })
    expect(res.status).toBe(404)
  })

  it('blocks collect on PENDING_REVIEW article', async () => {
    const token = getTokenFor(S.marcus.id, S.marcus.role, S.marcus.name, S.marcus.email)
    const res = await authedRequest(app, `/api/articles/${PENDING.id}/collect`, token, {
      method: 'POST',
    })
    expect(res.status).toBe(404)
  })

  it('blocks collect on ARCHIVED article', async () => {
    const token = getTokenFor(S.marcus.id, S.marcus.role, S.marcus.name, S.marcus.email)
    const res = await authedRequest(app, `/api/articles/${ARCHIVED.id}/collect`, token, {
      method: 'POST',
    })
    expect(res.status).toBe(404)
  })

  it('requires auth for collect', async () => {
    const res = await publicRequest(app, `/api/articles/${PUBLISHED.id}/collect`, {
      method: 'POST',
    })
    expect(res.status).toBe(401)
  })
})

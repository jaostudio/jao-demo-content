import { describe, it, expect, beforeAll } from 'vitest'
import { createTestApp, authedRequest, publicRequest, getFixtures, getTokenFor } from './helpers'

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

describe('GET /api/articles/:id/versions', () => {
  it('allows owner to view versions of own PUBLISHED article', async () => {
    const token = getTokenFor(S.sarah.id, S.sarah.role, S.sarah.name, S.sarah.email)
    const res = await authedRequest(app, `/api/articles/${PUBLISHED.id}/versions`, token)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
  })

  it('allows other authenticated user to view versions of PUBLISHED article', async () => {
    const token = getTokenFor(S.marcus.id, S.marcus.role, S.marcus.name, S.marcus.email)
    const res = await authedRequest(app, `/api/articles/${PUBLISHED.id}/versions`, token)
    expect(res.status).toBe(200)
  })

  it('blocks anonymous for PUBLISHED versions (endpoint requires auth)', async () => {
    const res = await publicRequest(app, `/api/articles/${PUBLISHED.id}/versions`)
    expect(res.status).toBe(401)
  })

  it('allows owner to view versions of own DRAFT', async () => {
    const token = getTokenFor(S.sarah.id, S.sarah.role, S.sarah.name, S.sarah.email)
    const res = await authedRequest(app, `/api/articles/${DRAFT.id}/versions`, token)
    expect(res.status).toBe(200)
  })

  it('blocks non-owner AUTHOR from viewing DRAFT versions', async () => {
    const token = getTokenFor(S.marcus.id, S.marcus.role, S.marcus.name, S.marcus.email)
    const res = await authedRequest(app, `/api/articles/${DRAFT.id}/versions`, token)
    expect(res.status).toBe(404)
  })

  it('allows ADMIN to view DRAFT versions', async () => {
    const token = getTokenFor(S.admin.id, S.admin.role, S.admin.name, S.admin.email)
    const res = await authedRequest(app, `/api/articles/${DRAFT.id}/versions`, token)
    expect(res.status).toBe(200)
  })

  it('allows owner to view PENDING_REVIEW versions', async () => {
    const token = getTokenFor(S.marcus.id, S.marcus.role, S.marcus.name, S.marcus.email)
    const res = await authedRequest(app, `/api/articles/${PENDING.id}/versions`, token)
    expect(res.status).toBe(200)
  })

  it('blocks non-owner AUTHOR from PENDING_REVIEW versions', async () => {
    const token = getTokenFor(S.sarah.id, S.sarah.role, S.sarah.name, S.sarah.email)
    const res = await authedRequest(app, `/api/articles/${PENDING.id}/versions`, token)
    expect(res.status).toBe(404)
  })

  it('allows ADMIN to view PENDING_REVIEW versions', async () => {
    const token = getTokenFor(S.admin.id, S.admin.role, S.admin.name, S.admin.email)
    const res = await authedRequest(app, `/api/articles/${PENDING.id}/versions`, token)
    expect(res.status).toBe(200)
  })

  it('allows owner to view ARCHIVED versions', async () => {
    const token = getTokenFor(S.leo.id, S.leo.role, S.leo.name, S.leo.email)
    const res = await authedRequest(app, `/api/articles/${ARCHIVED.id}/versions`, token)
    expect(res.status).toBe(200)
  })

  it('blocks anonymous for ARCHIVED versions', async () => {
    const res = await publicRequest(app, `/api/articles/${ARCHIVED.id}/versions`)
    expect(res.status).toBe(401)
  })

  it('allows ADMIN to view ARCHIVED versions', async () => {
    const token = getTokenFor(S.admin.id, S.admin.role, S.admin.name, S.admin.email)
    const res = await authedRequest(app, `/api/articles/${ARCHIVED.id}/versions`, token)
    expect(res.status).toBe(200)
  })

  it('returns 404 for non-existent article', async () => {
    const token = getTokenFor(S.sarah.id, S.sarah.role, S.sarah.name, S.sarah.email)
    const res = await authedRequest(app, `/api/articles/nonexistent-id/versions`, token)
    expect(res.status).toBe(404)
  })
})

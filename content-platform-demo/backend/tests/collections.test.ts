import { describe, it, expect, beforeAll } from 'vitest'
import { createTestApp, authedRequest, publicRequest, getFixtures, getTokenFor, postJson } from './helpers'

let app: ReturnType<typeof createTestApp>
let S: Record<string, { id: string; role: string; name: string; email: string }>
let SARAH_ID: string
let PUBLISHED: { id: string }
let DRAFT: { id: string }
let PENDING: { id: string }
let ARCHIVED: { id: string }
const SARAH_COL_SLUG = 'inspiring-works'

beforeAll(async () => {
  app = createTestApp()
  const f = await getFixtures()
  S = f.authors
  SARAH_ID = f.authors.sarah.id
  PUBLISHED = f.articles.letterpress
  DRAFT = f.articles.brandDraft
  PENDING = f.articles.photographyPending
  ARCHIVED = f.articles.archivedPortfolio
})

describe('GET /api/collections/public/:ownerId/:slug', () => {
  it('returns PUBLIC collection for anonymous', async () => {
    const res = await publicRequest(app, `/api/collections/public/${SARAH_ID}/${SARAH_COL_SLUG}`)
    expect(res.status).toBe(200)
  })

  it('returns PUBLIC collection for authenticated user', async () => {
    const token = getTokenFor(S.marcus.id, S.marcus.role, S.marcus.name, S.marcus.email)
    const res = await authedRequest(app, `/api/collections/public/${SARAH_ID}/${SARAH_COL_SLUG}`, token)
    expect(res.status).toBe(200)
  })

  it('returns 404 for non-existent collection', async () => {
    const res = await publicRequest(app, `/api/collections/public/${SARAH_ID}/no-such-collection`)
    expect(res.status).toBe(404)
  })
})

describe('POST /api/collections/:slug/items', () => {
  it('requires auth', async () => {
    const res = await postJson(app, `/api/collections/default/items`, {
      articleId: PUBLISHED.id,
    })
    expect(res.status).toBe(401)
  })

  it('cannot add DRAFT article to collection', async () => {
    const token = getTokenFor(S.leo.id, S.leo.role, S.leo.name, S.leo.email)
    const res = await postJson(
      app,
      `/api/collections/default/items`,
      { articleId: DRAFT.id },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    expect(res.status).toBe(404)
  })

  it('cannot add PENDING_REVIEW article to collection', async () => {
    const token = getTokenFor(S.leo.id, S.leo.role, S.leo.name, S.leo.email)
    const res = await postJson(
      app,
      `/api/collections/default/items`,
      { articleId: PENDING.id },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    expect(res.status).toBe(404)
  })

  it('cannot add ARCHIVED article to collection', async () => {
    const token = getTokenFor(S.leo.id, S.leo.role, S.leo.name, S.leo.email)
    const res = await postJson(
      app,
      `/api/collections/default/items`,
      { articleId: ARCHIVED.id },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    expect(res.status).toBe(404)
  })
})

import { describe, it, expect, beforeAll } from 'vitest'
import { createTestApp, authedRequest, publicRequest, getFixtures, getTokenFor } from './helpers'

let app: ReturnType<typeof createTestApp>
let S: Record<string, { id: string; role: string; name: string; email: string }>

beforeAll(async () => {
  app = createTestApp()
  const f = await getFixtures()
  S = f.authors
})

describe('/api/admin/* route access', () => {
  it('blocks anonymous from admin stats', async () => {
    const res = await publicRequest(app, '/api/admin/stats')
    expect(res.status).toBe(401)
  })

  it('blocks AUTHOR from admin stats', async () => {
    const token = getTokenFor(S.sarah.id, S.sarah.role, S.sarah.name, S.sarah.email)
    const res = await authedRequest(app, '/api/admin/stats', token)
    expect(res.status).toBe(403)
  })

  it('allows ADMIN to access admin stats', async () => {
    const token = getTokenFor(S.admin.id, S.admin.role, S.admin.name, S.admin.email)
    const res = await authedRequest(app, '/api/admin/stats', token)
    expect(res.status).toBe(200)
  })

  it('blocks anonymous from admin articles', async () => {
    const res = await publicRequest(app, '/api/admin/articles')
    expect(res.status).toBe(401)
  })

  it('blocks AUTHOR from admin articles', async () => {
    const token = getTokenFor(S.sarah.id, S.sarah.role, S.sarah.name, S.sarah.email)
    const res = await authedRequest(app, '/api/admin/articles', token)
    expect(res.status).toBe(403)
  })

  it('allows ADMIN to access admin articles', async () => {
    const token = getTokenFor(S.admin.id, S.admin.role, S.admin.name, S.admin.email)
    const res = await authedRequest(app, '/api/admin/articles', token)
    expect(res.status).toBe(200)
  })
})

describe('/api/studio/* route access', () => {
  it('blocks anonymous from studio stats', async () => {
    const res = await publicRequest(app, '/api/studio/stats')
    expect(res.status).toBe(401)
  })

  it('allows AUTHOR to access studio stats', async () => {
    const token = getTokenFor(S.sarah.id, S.sarah.role, S.sarah.name, S.sarah.email)
    const res = await authedRequest(app, '/api/studio/stats', token)
    expect(res.status).toBe(200)
  })

  it('allows ADMIN to access studio stats', async () => {
    const token = getTokenFor(S.admin.id, S.admin.role, S.admin.name, S.admin.email)
    const res = await authedRequest(app, '/api/studio/stats', token)
    expect(res.status).toBe(200)
  })
})

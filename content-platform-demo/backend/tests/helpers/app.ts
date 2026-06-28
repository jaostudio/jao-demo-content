import { Hono } from 'hono'
import auth from '../../src/routes/auth'
import articles from '../../src/routes/articles'
import updates from '../../src/routes/updates'
import transitions from '../../src/routes/transitions'
import comments from '../../src/routes/comments'
import likes from '../../src/routes/likes'
import categories from '../../src/routes/categories'
import tags from '../../src/routes/tags'
import search from '../../src/routes/search'
import trending from '../../src/routes/trending'
import admin from '../../src/routes/admin'
import studio from '../../src/routes/studio'
import follows from '../../src/routes/follows'
import feed from '../../src/routes/feed'
import authors from '../../src/routes/authors'
import collections from '../../src/routes/collections'
import publicCollections from '../../src/routes/collections-public'

export function createTestApp(): Hono {
  const app = new Hono()

  app.route('/api/auth', auth)
  app.route('/api/articles', articles)
  app.route('/api/articles', updates)
  app.route('/api/articles', transitions)
  app.route('/api/articles', comments)
  app.route('/api/articles', likes)
  app.route('/api/categories', categories)
  app.route('/api/tags', tags)
  app.route('/api/search', search)
  app.route('/api/trending', trending)
  app.route('/api/admin', admin)
  app.route('/api/studio', studio)
  app.route('/api/follows', follows)
  app.route('/api/feed', feed)
  app.route('/api/authors', authors)
  app.route('/api/collections', collections)
  app.route('/api/collections', publicCollections)

  return app
}

export function authedRequest(app: Hono, path: string, token: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers)
  headers.set('Authorization', `Bearer ${token}`)
  return app.request(path, { ...init, headers })
}

export function publicRequest(app: Hono, path: string, init?: RequestInit): Promise<Response> {
  return app.request(path, init)
}

export function postJson(
  app: Hono,
  path: string,
  body: unknown,
  init?: RequestInit,
): Promise<Response> {
  const headers = new Headers(init?.headers)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  return app.request(path, {
    method: 'POST',
    ...init,
    headers,
    body: JSON.stringify(body),
  })
}

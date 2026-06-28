import { Hono } from 'hono'
import { cors } from 'hono/cors'
import auth from './routes/auth'
import articles from './routes/articles'
import updates from './routes/updates'
import transitions from './routes/transitions'
import comments from './routes/comments'
import likes from './routes/likes'
import categories from './routes/categories'
import tags from './routes/tags'
import search from './routes/search'
import trending from './routes/trending'
import admin from './routes/admin'
import studio from './routes/studio'
import follows from './routes/follows'
import feed from './routes/feed'
import authors from './routes/authors'
import collections from './routes/collections'
import publicCollections from './routes/collections-public'

const app = new Hono()

app.use('/*', cors({
  origin: process.env.CORS_ORIGIN ?? ['http://localhost:3456', 'http://localhost:3000', 'https://jao-demo-content.vercel.app'],
  credentials: true,
}))

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

app.get('/api/ping', (c) => c.json({ ok: true, timestamp: new Date().toISOString() }))

export default app

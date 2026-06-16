import { serve } from '@hono/node-server'
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

const app = new Hono()

app.use('/*', cors({
  origin: ['http://localhost:3456', 'http://localhost:3000', 'https://jao-demo-content.vercel.app'],
  credentials: true,
}))

// Mount routes
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

// Health check
app.get('/api/ping', (c) => c.json({ ok: true, timestamp: new Date().toISOString() }))

const port = parseInt(process.env.PORT ?? '3001', 10)

serve({ fetch: app.fetch, port }, () => {
  console.log(`Backend server running on http://localhost:${port}`)
})

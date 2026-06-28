import { serve } from '@hono/node-server'
import app from './app'

const port = parseInt(process.env.PORT ?? '3001', 10)

serve({ fetch: app.fetch, port }, () => {
  console.log(`Backend server running on http://localhost:${port}`)
})

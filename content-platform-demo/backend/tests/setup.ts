import path from 'path'

const testDbPath = path.resolve(process.cwd(), 'prisma/test.db')
// Normalize Windows backslashes to forward slashes for file:// URL
const normalizedPath = testDbPath.replace(/\\/g, '/')
process.env.DATABASE_URL = `file:${normalizedPath}`
process.env.NEXTAUTH_SECRET = 'test-secret-for-vitest'
process.env.NODE_ENV = 'test'
// Clear any remote Turso config that might cause socket timeouts
process.env.TURSO_AUTH_TOKEN = ''

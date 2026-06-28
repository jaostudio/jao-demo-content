import path from 'path'

const testDbPath = path.resolve(process.cwd(), 'prisma/test.db')
process.env.DATABASE_URL = `file:${testDbPath}`
process.env.NEXTAUTH_SECRET = 'test-secret-for-vitest'
process.env.NODE_ENV = 'test'

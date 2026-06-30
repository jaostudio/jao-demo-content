import { PrismaClient } from '@prisma/security-client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'
import { initSandbox } from './sandbox'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function createPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL
  const tursoToken = process.env.TURSO_AUTH_TOKEN

  if (tursoUrl && tursoToken) {
    const adapter = new PrismaLibSql({ url: tursoUrl, authToken: tursoToken })
    return new PrismaClient({ adapter })
  }

  const localUrl = process.env.DATABASE_URL ?? `file:${path.join(process.cwd(), 'dev.db')}`
  const adapter = new PrismaLibSql({ url: localUrl })
  return new PrismaClient({ adapter })
}

/**
 * @deprecated Use getPrisma() for request code. This bypasses SANDBOX_MODE.
 */
export const realPrisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = realPrisma

export async function getPrisma(): Promise<PrismaClient> {
  if (process.env.SANDBOX_MODE === 'true') return initSandbox()
  return realPrisma
}

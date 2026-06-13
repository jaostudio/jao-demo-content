import { createClient } from '@libsql/client'
import { readFileSync } from 'fs'
import { join } from 'path'

async function main() {
  const dbUrl = process.env.DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!dbUrl || !authToken) {
    console.error('Missing DATABASE_URL or TURSO_AUTH_TOKEN')
    process.exit(1)
  }

  const turso = createClient({ url: dbUrl, authToken })

  const statements = [
    `ALTER TABLE Article ADD COLUMN format TEXT NOT NULL DEFAULT 'WRITING'`,
    `ALTER TABLE Article ADD COLUMN aiFreeDeclaration BOOLEAN NOT NULL DEFAULT false`,
    `ALTER TABLE Article ADD COLUMN likes INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE Article ADD COLUMN imageUrl TEXT`,
    `ALTER TABLE Article ADD COLUMN metaTitle TEXT`,
    `ALTER TABLE Article ADD COLUMN metaDescription TEXT`,
    `ALTER TABLE Article ADD COLUMN canonicalUrl TEXT`,
  ]

  for (const sql of statements) {
    try {
      await turso.execute(sql)
      console.log(`OK: ${sql.slice(0, 60)}...`)
    } catch (e: any) {
      if (e.message?.includes('duplicate column')) {
        console.log(`SKIP (already exists): ${sql.slice(0, 60)}...`)
      } else {
        console.error(`ERROR: ${e.message}`)
        process.exit(1)
      }
    }
  }

  console.log('Migration complete')
  turso.close()
}

main()

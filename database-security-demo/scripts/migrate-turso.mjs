import { createClient } from '@libsql/client'
import { readFileSync } from 'fs'

const sql = readFileSync(new URL('../prisma/audit-migration.sql', import.meta.url), 'utf8')

const client = createClient({
  url: process.env.DATABASE_URL ?? process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function main() {
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  let ok = 0, skip = 0, err = 0
  for (const stmt of statements) {
    try {
      await client.execute(stmt + ';')
      ok++
    } catch (e) {
      if (e.message?.includes('duplicate column')) {
        skip++
      } else {
        console.error(`ERROR: ${stmt.substring(0, 80)}...`)
        console.error(e.message)
        err++
      }
    }
  }

  console.log(`Migration: ${ok} applied, ${skip} skipped, ${err} errors`)
  process.exit(err > 0 ? 1 : 0)
}

main().catch(console.error)

import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.DATABASE_URL,
})

async function main() {
  const { rows } = await client.execute("PRAGMA table_info('AuditEvent')")
  console.log('AuditEvent columns:')
  for (const row of rows) {
    console.log(`  ${row.name} (${row.type}) ${row.notnull ? 'NOT NULL' : ''} default=${row.dflt_value}`)
  }
}

main().catch(console.error)

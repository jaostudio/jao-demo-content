import { createClient } from '@libsql/client'

const url = process.env.DATABASE_URL
console.log('Connecting with DATABASE_URL:', url?.slice(0, 50) + '...')

const client = createClient({ url })

const { rows } = await client.execute("PRAGMA table_info('AuditEvent')")
console.log('AuditEvent columns:')
for (const row of rows) {
  console.log(`  ${row.name} (${row.type}) notnull=${row.notnull} default=${row.dflt_value}`)
}

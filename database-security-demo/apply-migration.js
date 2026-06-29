const { createClient } = require('@libsql/client');
const fs = require('fs');

const sql = fs.readFileSync('./prisma/migration-init.sql', 'utf8');

const client = createClient({
  url: process.env.DATABASE_URL ?? process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  const existing = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log('Existing tables:', existing.rows.map(r => r.name));

  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  let ok = 0, skip = 0, err = 0;
  for (const stmt of statements) {
    try {
      await client.execute(stmt + ';');
      ok++;
    } catch (e) {
      if (e.message?.includes('already exists')) {
        skip++;
      } else {
        console.error(`ERROR: ${stmt.substring(0, 80)}...`);
        console.error(e.message);
        err++;
      }
    }
  }

  const after = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log('Tables after migration:', after.rows.map(r => r.name));
  console.log(`Results: ${ok} created, ${skip} skipped, ${err} errors`);
}

main().catch(console.error);

#!/usr/bin/env node

class CookieJar {
  #cookies = new Map<string, string>();

  consume(headers: Headers): void {
    for (const [key, value] of headers) {
      if (key.toLowerCase() !== 'set-cookie') continue;
      const [nv] = value.split(';');
      const eq = nv.indexOf('=');
      if (eq === -1) continue;
      this.#cookies.set(nv.slice(0, eq).trim(), nv.slice(eq + 1).trim());
    }
  }

  get header(): string {
    return [...this.#cookies].map(([k, v]) => `${k}=${v}`).join('; ');
  }

  hasSessionToken(): boolean {
    for (const key of this.#cookies.keys()) {
      if (key.includes('session-token') || key.includes('next-auth.session-token')) {
        return true;
      }
    }
    return false;
  }
}

interface User {
  email: string;
  password: string;
  role?: string;
}

interface App {
  name: string;
  baseUrl: string;
  users: User[];
  hasRole: boolean;
}

const apps: App[] = [
  {
    name: 'Marketplace',
    baseUrl: 'https://jao-demo-marketplace.vercel.app',
    users: [
      { email: 'admin@marketplace.dev', password: 'password123', role: 'ADMIN' },
      { email: 'alice@crafts.com', password: 'password123', role: 'VENDOR' },
      { email: 'buyer@test.com', password: 'password123', role: 'BUYER' },
    ],
    hasRole: true,
  },
  {
    name: 'Content Platform',
    baseUrl: 'https://jao-demo-content.vercel.app',
    users: [
      { email: 'admin@content.dev', password: 'password123', role: 'ADMIN' },
      { email: 'author@content.dev', password: 'password123', role: 'AUTHOR' },
    ],
    hasRole: true,
  },
  {
    name: 'Web Application',
    baseUrl: 'https://jao-demo-webapp.vercel.app',
    users: [
      { email: 'alice@example.com', password: 'password123' },
      { email: 'bob@example.com', password: 'password123' },
      { email: 'carol@example.com', password: 'password123' },
    ],
    hasRole: false,
  },
  {
    name: 'Database Security',
    baseUrl: 'https://jao-demo-security.vercel.app',
    users: [
      { email: 'sysadmin@security.dev', password: 'password123', role: 'SYSTEM_ADMIN' },
      { email: 'admin@security.dev', password: 'password123', role: 'ORG_ADMIN' },
      { email: 'user@security.dev', password: 'password123', role: 'ORG_USER' },
    ],
    hasRole: true,
  },
];

function encodeForm(data: Record<string, string>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    params.append(key, value);
  }
  return params.toString();
}

let passed = 0;
let failed = 0;

async function testUser(app: App, user: User): Promise<boolean> {
  const jar = new CookieJar();

  try {
    const csrfRes = await fetch(`${app.baseUrl}/api/auth/csrf`);
    if (!csrfRes.ok) throw new Error(`CSRF fetch failed (${csrfRes.status})`);
    const { csrfToken } = (await csrfRes.json()) as { csrfToken: string };

    const loginRes = await fetch(`${app.baseUrl}/api/auth/callback/credentials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeForm({ email: user.email, password: user.password, csrfToken }),
      redirect: 'manual',
    });
    jar.consume(loginRes.headers);
    if (!jar.hasSessionToken()) {
      throw new Error('set-cookie missing next-auth.session-token');
    }

    const sessionRes = await fetch(`${app.baseUrl}/api/auth/session`, {
      headers: { cookie: jar.header },
    });
    if (!sessionRes.ok) throw new Error(`session fetch failed (${sessionRes.status})`);
    const session = (await sessionRes.json()) as {
      user?: { email?: string; role?: string };
    };
    if (!session.user) throw new Error('session.user is null/undefined');
    if (session.user.email !== user.email) {
      throw new Error(`email mismatch: got "${session.user.email}"`);
    }
    if (app.hasRole && user.role) {
      if (session.user.role !== user.role) {
        throw new Error(`role mismatch: got "${session.user.role}"`);
      }
      console.log(`  ✓ ${user.email} login (${user.role})`);
    } else {
      console.log(`  ✓ ${user.email} login`);
    }
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`  ✗ ${user.email} login - ${msg}`);
    return false;
  }
}

async function main() {
  for (let i = 0; i < apps.length; i++) {
    if (i > 0) console.log();
    console.log(apps[i].name);
    for (const user of apps[i].users) {
      const ok = await testUser(apps[i], user);
      if (ok) passed++;
      else failed++;
    }
  }

  console.log();
  if (failed === 0) {
    console.log(`All ${passed} auth tests passed.`);
    process.exit(0);
  } else {
    console.log(`${failed} test(s) failed out of ${passed + failed}.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});

# Deployment

## Overview

The monorepo contains 7 deployable applications (6 demos + jaostudio portfolio).
Each is independently deployable to Vercel.

Build is **pure** — no Prisma migrations, seeding, or database writes occur during `vercel build`. All database operations (schema deployment, seeding) are run externally in a CI gated job or locally before deployment.

## Project Names

| Vercel project | Demo directory | Port (dev) | Auth | Database | Env vars needed |
|---|---|---|---|---|---|
| `jao-demo-landing` | `landingpage-demo` | 3000 | None | None | None |
| `jao-demo-commerce` | `commerce-demo` | 3001 | NextAuth (admin) | Prisma + Turso | `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` |
| `jao-demo-content` | `content-platform-demo` | 3003 | NextAuth (author/admin) | Prisma + Turso | `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` |
| `jao-demo-marketplace` | `marketplace-demo` | 3002 | NextAuth (multi-role) | Prisma + Turso | `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` |
| `jao-demo-webapp` | `web-application-demo` | 3004 | NextAuth (org roles) | Prisma + Turso | `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` |
| `jao-demo-security` | `database-security-demo` | 3005 | NextAuth (RBAC) | Prisma + Turso | `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` |

## Environment Variables

### Generate auth secrets

Per-demo, unique:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Production env matrix

| Project | `DATABASE_URL` | `NEXTAUTH_SECRET` | `NEXTAUTH_URL` |
|---|---|---|---|
| `jao-demo-commerce` | `libsql://jao-commerce-...turso.io?authToken=...` | *per-demo secret* | `https://jao-demo-commerce.vercel.app` |
| `jao-demo-content` | `libsql://jao-content-...turso.io?authToken=...` | *per-demo secret* | `https://jao-demo-content.vercel.app` |
| `jao-demo-marketplace` | `libsql://jao-marketplace-...turso.io?authToken=...` | *per-demo secret* | `https://jao-demo-marketplace.vercel.app` |
| `jao-demo-webapp` | `libsql://jao-webapp-...turso.io?authToken=...` | *per-demo secret* | `https://jao-demo-webapp.vercel.app` |
| `jao-demo-security` | `libsql://jao-security-...turso.io?authToken=...` | *per-demo secret* | `https://jao-demo-security.vercel.app` |

Values for all 5 Turso databases and tokens are stored in the chat log (deployment session).

### Auth config

All 4 NextAuth configs include:
- `secret: process.env.NEXTAUTH_SECRET`
- `trustHost: true` — required for Vercel headers + preview deployments

### Local development

Copy `.env.example` to `.env` in each demo:

```bash
cp commerce-demo/.env.example commerce-demo/.env
```

landingpage-demo has no env requirements.

## Vercel Project Settings

Each demo project (root directory = repo root):

| Setting | Value |
|---|---|
| Root Directory | (blank — repo root) |
| Build Command | `turbo run build --filter=<demo>` |
| Output Directory | `<demo>/.next` |
| Install Command | `npm ci` |
| Framework | Next.js |
| Node.js Version | 22.x |

## Build Safety

- `build` scripts contain only `next build` or `turbo build` — **no** `prisma db push`, `prisma generate`, or seeding in Vercel.
- Schema deployment (`prisma migrate diff` → Turso HTTP API) runs **locally or in CI**, never during Vercel build.
- Seeding runs **locally or in CI**, never during Vercel build.

## Deployment Order

### Phase 1 (zero risk, canary)

1. **jao-demo-landing** — static, no env vars — verify it loads

### Phase 2 (single-domain state)

2. **jao-demo-commerce** — simplest DB-backed demo

### Phase 3 (moderate complexity)

3. **jao-demo-content** — editorial workflow, author/admin roles

### Phase 4 (multi-entity + auth complexity)

4. **jao-demo-marketplace** — multi-vendor, buyer/vendor/admin roles

### Phase 5 (multi-tenant stress system)

5. **jao-demo-webapp** — org isolation, 8 models

### Phase 6 (security-critical system)

6. **jao-demo-security** — RBAC, audit trail, middleware — validates entire auth/infra stack

## jaostudio Portfolio

The jaostudio site is independent (not in npm workspaces). It has its own `next.config.ts`
and Vercel configuration in `.vercel/`. Deploy as a separate Vercel project pointing to the
`jaostudio/` subdirectory. Node.js version must be set to 22.x (currently 24.x).

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push/PR to main:

1. `npm ci` — clean install
2. `npm run lint` — ESLint across all workspaces (turbo)
3. `npm run build` — Build all demos (turbo)
4. `npm run check:arch` — Dependency graph, machine tests, event tests

Database deployment (schema + seed) is **not** part of CI — it runs explicitly on demand.

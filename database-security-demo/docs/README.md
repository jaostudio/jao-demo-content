# IslaVault

Secure client portals for distributed organizations.

A fictional Philippine-inspired secure client portal demonstrating tenant isolation, RBAC, audit trails, and Turso-backed database security for multi-tenant B2B systems.

## What It Demonstrates

- **Tenant isolation** — all queries scoped by organizationId from JWT; client-provided orgId is rejected
- **Role-based access control** — SYSTEM_ADMIN, ORG_ADMIN, ORG_USER enforced server-side
- **Immutable audit trail** — every mutation and denied access logged with causationId chains
- **Security headers** — CSP, HSTS, X-Frame-Options, Permissions-Policy via middleware
- **Cross-tenant blocking** — 404 returned (not 403) to avoid confirming existence
- **Security Lab** — interactive attack simulations with real server enforcement

## Architecture

- **Framework**: Next.js 16 (App Router) with React 19
- **Database**: Turso/libSQL via Prisma adapter (SQLite-compatible, serverless)
- **ORM**: Prisma 7 with `@prisma/adapter-libsql`
- **Auth**: NextAuth v4 with JWT (role + orgId embedded in token)
- **Styling**: Tailwind CSS v4 with custom dark theme
- **Animation**: Framer Motion
- **Deployment**: Vercel

## Database

IslaVault uses Turso/libSQL as a serverless SQLite-compatible database. Tenant isolation is enforced through server-side session scope, RBAC guards, and organization-scoped queries. The production upgrade path supports database-per-tenant isolation for stricter customer boundaries.

### Migration Workflow

Prisma Migrate is not supported directly against Turso. Generate migrations locally against SQLite, then apply to Turso:

```bash
# 1. Generate migration locally
npx prisma migrate dev --name <name>

# 2. Apply generated SQL to Turso
turso db shell islavault-dev < prisma/migrations/<migration_name>/migration.sql

# 3. Generate Prisma client
npx prisma generate

# 4. Seed Turso
npm run db:seed
```

## Demo Accounts

| Email | Role | Organization |
|-------|------|-------------|
| maria@luntian.demo | ORG_ADMIN | Luntian Health Network |
| paolo@luntian.demo | ORG_USER | Luntian Health Network |
| ana@talapay.demo | ORG_USER | TalaPay Cooperative |
| rafael@islavault.demo | SYSTEM_ADMIN | Global |

Password for all: `password123`

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Lint all files |
| `npm run typecheck` | TypeScript type check (no emit) |
| `npm run test` | Run Vitest unit tests |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Re-seed database |
| `npm run db:reset` | Reset and re-seed database |
| `npm run db:migrate:local` | Generate local Prisma migration |
| `npm run db:studio` | Open Prisma Studio |

## Tenants

- **Luntian Health Network** — regional healthcare group
- **TalaPay Cooperative** — financial cooperative
- **Bayani Freight Systems** — logistics company
- **Sampaguita Export House** — export business

All organizations, users, and documents are fictional.

## Pre-Deploy Gate

Before any deployment, run the full command gate:

```bash
npm run typecheck    # TypeScript: 0 errors
npm run lint         # ESLint: 0 errors (warnings are pre-existing Prisma any-casts)
npm run build        # Next.js build: 0 errors (17 routes)
npm run test         # Vitest: 38 tests (4 files), all passing
npm run test:e2e     # Playwright: 50 tests (6 spec files), all passing
```

### Test Coverage

| Suite | File | Tests |
|-------|------|-------|
| Unit | `tests/unit/rbac.test.ts` | 12 |
| Unit | `tests/unit/audit-actions.test.ts` | 10 |
| Unit | `tests/unit/access-decision.test.ts` | 7 |
| Unit | `tests/unit/security-lab-types.test.ts` | 9 |
| E2E | `tests/e2e/auth-pages.spec.ts` | 6 |
| E2E | `tests/e2e/golden-demo.spec.ts` | 10 |
| E2E | `tests/e2e/security-lab-api.spec.ts` | 11 |
| E2E | `tests/e2e/tenant-isolation.spec.ts` | 4 |
| E2E | `tests/e2e/rbac.spec.ts` | 12 |
| E2E | `tests/e2e/a11y.spec.ts` | 6 |
| **Total** | | **88** |

### Lighthouse Scores (Production Build)

| Route | Perf | A11y | BP | SEO | LCP | CLS | TBT |
|-------|------|------|----|-----|-----|-----|-----|
| / | 71 | 95 | 96 | 100 | 6.19s | 0.000 | 326ms |
| /signin | 57 | 92 | 96 | 100 | 4.65s | 0.000 | 1529ms |
| /dashboard | 76 | 92 | 96 | 100 | 3.85s | 0.000 | 490ms |
| /documents | 72 | 92 | 96 | 100 | 4.88s | 0.000 | 408ms |
| /security-lab | 87 | 92 | 96 | 100 | 1.79s | 0.000 | 505ms |

Scores are from local production build. Performance improves significantly on Vercel (CDN, ISR, optimized bundles). Amethyst button contrast (4.23:1 vs 4.5:1 threshold) is a documented design tradeoff — buttons have strong layout affordance compensating for the borderline ratio.

## QA Checklist — Manual Verification

### Auth
- [ ] /signin renders brand panel (left) + auth card (right)
- [ ] /register renders same layout
- [ ] Sign in with each demo account succeeds
- [ ] Invalid credentials show error
- [ ] Unauthenticated access to /dashboard, /documents, /security-lab, /settings redirects to /signin

### Tenant Isolation
- [ ] Maria (Luntian) sees only Luntian org name on dashboard
- [ ] Maria sees only Luntian documents on /documents
- [ ] Ana (TalaPay) sees "TalaPay Cooperative" on dashboard
- [ ] Ana sees only TalaPay documents on /documents
- [ ] Cross-tenant page refresh preserves scope

### RBAC
- [ ] ORG_USER (Paolo) cannot access /admin/users — redirect to /dashboard
- [ ] ORG_USER (Paolo) cannot access /admin/organizations — redirect to /dashboard
- [ ] SYSTEM_ADMIN (Rafael) can access /admin/users and /admin/organizations
- [ ] ORG_ADMIN (Maria) cannot see SYSTEM_ADMIN-only nav items

### Audit Trail
- [ ] /audit shows events in reverse chronological order
- [ ] Badges use correct color per audit action type
- [ ] Each login, document creation, and denied access is logged

### Security Lab
- [ ] All 5 simulations return correct verdict (ALLOWED/DENIED)
- [ ] Cross-tenant access simulation returns DENIED (404)
- [ ] Each simulation writes to audit log

### Security Headers
- [ ] curl -I http://localhost:3000/ includes all 7 headers:
  - Content-Security-Policy, X-Frame-Options: DENY, X-Content-Type-Options: nosniff,
    X-XSS-Protection: 0, Referrer-Policy: strict-origin-when-cross-origin,
    Strict-Transport-Security, Permissions-Policy

### Visual
- [ ] Full dark theme (obsidian/volcanic/harbor backgrounds)
- [ ] Amethyst accents on buttons and links
- [ ] No emoji anywhere in the UI (Lucide icons only)
- [ ] Responsive: sidebar collapses on mobile
- [ ] Reduced motion respected (prefers-reduced-motion: reduce)

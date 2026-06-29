# IslaVault

Secure client portals for distributed organizations.

A fictional Philippine-inspired secure client portal demonstrating **tenant isolation**, **RBAC**, **immutable audit trails**, and **Turso-backed database security** for multi-enterprise B2B systems. Built as a portfolio proof-of-concept showcasing security-first full-stack architecture.

> **Live Demo:** _coming soon_ <!-- update after deploy -->

## Reviewer Script

Walk through the security proof path in under 5 minutes:

1. **Sign in as Jao** — `jao@luntian.demo` / `password123`
2. **Confirm tenant scope** — Dashboard shows "Luntian Health" and "Tenant Scope Active"
3. **Try cross-tenant access** — Go to Security Lab, run "Cross-Tenant Document Access" → see **BLOCKED (404)**
4. **Inspect the audit trail** — Open Audit Trail, find the `CROSS_TENANT_DENIED` event
5. **Verify document isolation** — Go to Documents → only 5 Luntian documents visible (no TalaPay docs)
6. **Test RBAC** — Navigate directly to `/admin/users` → redirected to `/dashboard`
7. **Switch to Grace** — Use demo switcher in topbar → confirm SYSTEM_ADMIN role
8. **Confirm global scope** — Documents page now shows all 17 documents across all tenants
9. **Test admin access** — `/admin/users` loads with Create User form
10. **Verify audit persistence** — Return to Audit Trail → all simulation events are persisted

## What It Demonstrates

- **Tenant isolation** — all queries scoped by organizationId from JWT; client-provided orgId is rejected server-side
- **Role-based access control** — SYSTEM_ADMIN, ORG_ADMIN, ORG_USER enforced on every server action and page layout
- **Immutable audit trail** — every mutation and denied access logged with canonical audit actions
- **Security headers** — CSP, HSTS, X-Frame-Options, Permissions-Policy via `next.config.ts` headers()
- **Cross-tenant blocking** — 404 returned (not 403) to avoid confirming existence
- **Security Lab** — interactive attack simulations with real server enforcement and animated step traces

## Architecture

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) with React 19 |
| **Database** | Turso/libSQL via Prisma adapter (SQLite-compatible, serverless) |
| **ORM** | Prisma 7 with `@prisma/adapter-libsql` |
| **Auth** | NextAuth v4 with JWT (role + orgId embedded in token) |
| **Styling** | Tailwind CSS v4 with custom dark theme |
| **Animation** | Framer Motion (transform/opacity only, reduced-motion respected) |
| **Testing** | Vitest (unit) + Playwright (E2E + API) + axe-core (a11y) |
| **Deployment** | Vercel |

## Database

IslaVault uses Turso/libSQL as a serverless SQLite-compatible database. For MVP, all tenants share one database with `organizationId` scoping. The production upgrade path supports database-per-tenant isolation.

### Migration Workflow

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
| jao@luntian.demo | ORG_ADMIN | Luntian Health |
| gina@talapay.demo | ORG_ADMIN | TalaPay |
| kiko@bayani.demo | ORG_USER | Bayani Freight |
| grace@pulodata.demo | SYSTEM_ADMIN | Global Control Plane |

Password for all: `password123`

## Known Tradeoffs

- **SQLite-compatible Turso demo database** — uses libSQL (SQLite-compatible), not PostgreSQL with row-level security. Isolation is enforced at the application layer, not the database layer.
- **Shared-database tenant model** — single database for MVP efficiency. Production upgrade supports dedicated databases per tenant.
- **JWT sessions can become stale** — role/orgId changes require re-login. No session invalidation on role change.
- **Audit logs are append-only at app layer** — not WORM (Write Once Read Many) storage. A production audit system would use immutable storage or cryptographic chaining.
- **Security Lab is intentionally instrumented** — the attack simulations are pre-built demonstrations for portfolio proof, not penetration test coverage.
- **Amethyst button contrast (4.23:1)** — falls just below the WCAG AA 4.5:1 threshold for normal text. Buttons have strong layout affordance (rounded rect, hover state, focus ring, position) compensating for the borderline ratio.

## Production Upgrade Path

| Current (MVP) | Production Target |
|---------------|-------------------|
| Single Turso database | Database-per-tenant with routing middleware |
| Application-layer tenant isolation | Row-level security + app-layer enforcement |
| JWT sessions | Server-side sessions with Redis |
| Append-only audit at app layer | WORM-compatible audit storage with cryptographic verification |
| Prisma migrate against SQLite | Prisma migrate against Turso directly (when supported) |
| `organizationId` scoping in queries | Database-per-tenant connection pooling |

## Testing Coverage

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

## Lighthouse Scores (Production Build)

| Route | Perf | A11y | Best Practices | SEO | LCP | CLS | TBT |
|-------|------|------|---------------|-----|-----|-----|-----|
| / | 71 | 95 | 96 | 100 | 6.19s | 0.000 | 326ms |
| /signin | 57 | 92 | 96 | 100 | 4.65s | 0.000 | 1529ms |
| /dashboard | 76 | 92 | 96 | 100 | 3.85s | 0.000 | 490ms |
| /documents | 72 | 92 | 96 | 100 | 4.88s | 0.000 | 408ms |
| /security-lab | 87 | 92 | 96 | 100 | 1.79s | 0.000 | 505ms |

Scores are from local production build. Performance improves significantly on Vercel (CDN, ISR, optimized bundles). CLS is perfect (0.000) across all routes. See [Known Tradeoffs](#known-tradeoffs) for the documented amethyst contrast exception.

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

```bash
npm run typecheck    # TypeScript: 0 errors
npm run lint         # ESLint: 0 errors (warnings are pre-existing Prisma any-casts)
npm run build        # Next.js build: 0 errors (17 routes)
npm run test         # Vitest: 38 tests (4 files), all passing
npm run test:e2e     # Playwright: 50 tests (6 spec files), all passing
```

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

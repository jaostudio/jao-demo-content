# Architecture

## Stack

| Layer | Technology | Justification |
|---|---|---|
| Framework | Next.js 14+ | SSR, routing, API routes, Vercel deployment |
| Language | TypeScript | Type safety, maintainability |
| Styling | Tailwind CSS | Utility-first, design token integration |
| Database | PostgreSQL / Turso | Relational data, Turso for edge / lighter weight |
| ORM | Prisma / Drizzle | Type-safe queries, migrations |
| Auth | [NextAuth / Clerk / Custom] | [Justification] |
| Testing | Playwright | E2E, component, visual regression |
| Deployment | Vercel | Zero-config, preview deployments |
| Analytics | [PostHog / Plausible / GA4] | [Justification] |

## App Structure

```
src/
  app/
    (public)/        — Public routes (/, /portfolio, /pricing)
    (auth)/          — Auth routes (login, register)
    (dashboard)/     — Authenticated routes (dashboard, settings)
    api/             — API routes
  components/
    ui/              — Reusable UI primitives
    layout/          — Layout components (header, footer, shell)
    marketing/       — Marketing page components
    forms/           — Form components
  features/
    pricing/         — Pricing and quote builder feature
      components/
      actions/
      schemas/
      queries/
      types.ts
    portfolio/       — Portfolio feature
    auth/            — Auth feature
    admin/           — Admin feature
  lib/
    auth/            — Auth utilities
    db/              — Database client
    env/             — Environment variable validation
    logger/          — Logging utilities
    rate-limit/      — Rate limiting
    analytics/       — Analytics utilities
    security/        — Security utilities
  server/
    jobs/            — Background job definitions
    mail/            — Email sending
    storage/         — File storage
  styles/            — Global styles, design tokens
  tests/
    unit/
    e2e/
    visual/
    accessibility/
```

## Feature Boundary Rules

```
- Feature-specific logic stays inside `features/<feature>`.
- Shared primitives go into `components/ui` or `lib`.
- No cross-feature imports unless intentional.
- Feature `actions/` may call across features if architecturally approved.
```

## Data Model

See `DATA_MODEL.md` for entity definitions, relationships, and migration strategy.

## Auth Model

See `AUTHORIZATION_MODEL.md` for auth flow, session handling, and role definitions.

## API Boundaries

| Route | Method | Auth | Rate Limited | Purpose |
|---|---|---|---|---|
| `/api/contact` | POST | No | Yes | Contact form submission |
| `/api/quote` | POST | No | Yes | Quote request submission |
| `/api/projects` | GET | Yes | No | List user projects |
| `/api/projects/[id]` | GET | Yes | No | Single project detail |
| `/api/projects/[id]` | PUT | Yes | No | Update project |
| `/api/admin/users` | GET | Admin | No | Admin user management |

## Caching Strategy

```
- Static pages: ISR with revalidation period.
- API responses: Server-side caching where data is not user-specific.
- Auth sessions: JWT or database session with configurable expiry.
- No client-side caching of sensitive data.
```

## Rate Limiting

```
- Public POST endpoints: 10 requests per minute per IP.
- Authenticated POST endpoints: 60 requests per minute per user.
- API routes: configured per route based on sensitivity.
```

## Logging

```
- Structured JSON logging in production.
- Log level: info for normal operations, warn for edge cases, error for failures.
- No sensitive data in logs.
- Request ID correlation across services.
```

## Error Handling

```
- API routes return structured errors: { error: string, code: string, details?: any }
- Server actions return typed results: { success: true, data } | { success: false, error }
- Unhandled errors caught by global error boundary.
- 404 handled by not-found page.
- 500 handled by error page.
```

## Background Jobs

```
- Queue: [Bull / Inngest / None for MVP]
- Jobs: [List background jobs]
- Retry policy: [Retry count, backoff strategy]
```

## Deployment

See `DEPLOYMENT_TEMPLATE.md` for CI/CD pipeline, environment configuration, and rollback procedure.

## Environment Variables

| Variable | Required | Secret | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | Yes | Database connection string |
| `AUTH_SECRET` | Yes | Yes | Session encryption key |
| `NEXT_PUBLIC_ANALYTICS_ID` | No | No | Analytics script ID |

## Failure Recovery

See `FAILURE_RECOVERY_TEMPLATE.md` for backup strategy, rollback procedures, and incident response.

## MVP vs Scale

See `MVP_VS_SCALE_TEMPLATE.md` in `01-product/` for tradeoff documentation.

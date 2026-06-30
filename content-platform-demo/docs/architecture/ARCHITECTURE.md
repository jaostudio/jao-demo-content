# Architecture — Likha

## Stack

| Layer | Technology | Justification |
|---|---|---|
| Framework | Next.js 15 | SSR, API routes, file-based routing, Vercel deployment |
| Language | TypeScript | Type safety, maintainability |
| Styling | Tailwind CSS v4 with CSS custom properties | Utility-first, design token integration via CSS variables |
| Database | Turso (LibSQL), SQLite locally | Edge-distributed SQL for preview deploys, file:./dev.db for local dev |
| ORM | Prisma with `@prisma/adapter-libsql` | Type-safe queries, migrations, Turso-compatible adapter |
| Auth | Custom JWT (bcryptjs + jose) | Lightweight auth without external provider; localStorage + cookie token |
| Testing | Vitest (unit), Playwright (E2E + visual) | Fast unit tests, comprehensive browser QA |
| Deployment | Vercel (frontend + API) | Single-project deploy, no separate backend host |
| Package Mgmt | npm workspaces (Turborepo monorepo) | Shared packages across apps |

## App Structure

```
content-platform-demo/
  src/
    app/
      (auth)/          — Auth routes (signin, register)
      (public)/        — Public routes (explore, search, trending)
      admin/           — Admin routes (dashboard, review, analytics)
      studio/          — Artist routes (dashboard, new, edit, versions)
      api/             — API routes (Hono app at /api/[[...route]])
      layout.tsx       — Root layout
    components/
      new/             — Current component system
        layout/        — Header, footer, auth-shell, right-panel
        pages/         — Page-level components (auth, studio, admin)
        ui/            — Reusable UI primitives (button, card, badge)
        demo/          — Demo tour, demo access components
      theme-toggle.tsx — Theme toggle (light/dark)
    hooks/
      useAuth.tsx      — Auth context provider
      use-effective-role.ts — Role resolution (auth + demo mode)
    lib/
      auth/            — Server-side auth (getCurrentAuthor, redirect)
      utils/           — API client, format helpers
      api/             — Server-side API integration
    store/             — Zustand stores (demo-role, UI state)
  backend/
    src/
      routes/          — Hono route handlers
        auth.ts        — Login, register, me endpoints
        articles.ts    — Article CRUD endpoints
        admin.ts       — Admin stats, review, analytics
        seed.ts        — Data seeding script
      lib/
        prisma.ts      — Prisma client initialization
    prisma/
      schema.prisma    — Database schema (Author, Article, Category, Tag, etc.)
      migrations/      — Prisma migration files
  shared/
    src/
      client.ts        — API client for browser/server
      types.ts         — Shared TypeScript types
      schemas/         — Validation schemas
```

## Feature Boundary Rules

- Feature-specific logic stays inside the relevant `src/app/[feature]/` route group.
- Shared UI primitives into `src/components/new/ui/`.
- No cross-feature imports between route groups (e.g., admin must not import from studio).
- Data fetching organized by route: server components fetch directly, client components use API.

## Auth Model

See `AUTHORIZATION_MODEL.md` for full details.

Current implementation:
- JWT tokens generated on login, stored in `localStorage` client-side.
- Server-side `getCurrentAuthor()` reads `likha-token` from cookie.
- Known bug: sign-in flow uses `router.refresh()` which triggers server re-render without cookie, causing redirect loop. Fix: set cookie on login response or use `likha-demo-role` cookie for demo mode.
- Demo mode uses `likha-demo-role` cookie directly, bypassing JWT validation.

## API Boundaries

| Route | Method | Auth | Rate Limited | Purpose |
|---|---|---|---|---|
| `/api/auth/login` | POST | No | Yes | User login |
| `/api/auth/register` | POST | No | Yes | User registration |
| `/api/auth/me` | GET | Bearer token | No | Current user info |
| `/api/articles` | GET | No | No | List articles (with filters) |
| `/api/articles/[id]` | GET | No | No | Article detail with author |
| `/api/articles` | POST | Bearer token | No | Create article |
| `/api/articles/[id]` | PATCH | Bearer token | No | Update article |
| `/api/articles/[id]/versions` | GET | No | No | Version history |
| `/api/comments` | GET | No | No | List article comments |
| `/api/comments` | POST | No | No | Create comment |
| `/api/admin/stats` | GET | Admin | No | Dashboard statistics |
| `/api/admin/pending` | GET | Admin | No | Pending review items |
| `/api/admin/analytics` | GET | Admin | No | Analytics data |
| `/api/feed` | GET | No | No | Content feed |
| `/api/search` | GET | No | Yes | Search articles |

## Database Schema

See `DATA_MODEL.md` for full entity definitions.

Key entities:
- **Author**: id, name, email, password (bcrypt), role (AUTHOR/ADMIN), image, bio, specialty
- **Article**: id, title, slug, format (WRITING/DRAWING/VIDEO/AUDIO), status, provenanceStatus, content, likes
- **ArticleVersion**: id, articleId, version, content, changeNote, mediaUrl, createdAt
- **Category**: id, name, slug
- **Tag**: id, name, slug
- **Comment**: id, articleId, authorName, authorEmail, body, createdAt
- **Collection**: id, ownerId, title, slug, description, cover, visibility
- **Follow**: followerId, followingId

## Caching Strategy

- Static pages: Static generation at build time where possible (privacy, terms, security-policy).
- Dynamic pages (articles, feed): Server-side rendered with `revalidate: 0` for fresh data.
- API responses: No aggressive caching — data changes frequently with user edits.
- Auth sessions: JWT-based, stateless. No server-side session store.

## Rate Limiting

- Public POST endpoints (login, register): Implemented per-IP via in-memory tracking.
- Authenticated endpoints: Not yet rate-limited (MVP scope).
- Search endpoint: Should be limited per-IP to prevent abuse.

## Logging

- Structured console logging with `console.error("[label] ...")` pattern for client-side errors.
- Server-side errors logged via Hono middleware.
- No production logging infrastructure yet (MVP scope).

## Error Handling

- API routes return structured JSON errors via Hono.
- Admin dashboard uses per-endpoint try/catch with degradation banners.
- Client-side `apiClient` wraps fetch with error normalization.
- Global Next.js error boundary for unhandled exceptions (admin/error.tsx).
- 404 handled by not-found page.
- 500 handled by error page.

## Background Jobs

- No background job infrastructure (MVP scope).
- Future: Queue for email notifications, scheduled analytics aggregation.

## Deployment

See `DEPLOYMENT.md` for deployment configuration.

Target: Vercel + Turso only. No Railway. No separate backend host.

## Environment Variables

| Variable | Required | Secret | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | Yes | Turso database URL or `file:./dev.db` for local |
| `TURSO_AUTH_TOKEN` | No | Yes | Turso auth token (not needed for local SQLite) |
| `JWT_SECRET` | Yes | Yes | JWT signing secret |
| `BACKEND_URL` | No (dev only) | No | Backend URL for server-side auth validation (defaults to localhost:3001; known issue) |
| `NEXT_PUBLIC_APP_URL` | No | No | Public app URL for OG images |

## Known Technical Issues

1. **Two dev.db files**: Seed writes to `backend/dev.db`, runtime reads from root `dev.db` (via `.env.local`). Fix: run seed from root OR set `DATABASE_URL` consistently.
2. **Auth cookie never set**: Client-side sign-in stores token in `localStorage` only; server-side `getCurrentAuthor()` reads cookie. Fix: set `likha-token` cookie in login response handler.
3. **BACKEND_URL port mismatch**: Server-side token validation defaults to `localhost:3001`. Dev server runs on `localhost:3090` (or 3000). Fix: set `BACKEND_URL` env var or remove dependency on external validation.

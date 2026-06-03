# Monorepo Architecture

## Overview
This monorepo contains 6 independently deployable demo applications showcasing different website archetypes. Each demo is a standalone Next.js 16 app (flat at root for direct Vercel deployment). Shared packages provide state machines, engine types, UI components, and analytics.

## Structure

```
Portfolio contents/
├── package.json                 ← npm workspaces root
├── tsconfig.base.json           ← shared TypeScript config
├── docs/                        ← cross-project documentation
├── packages/                    ← shared internal libraries
│   ├── core/                    ← State machines, events, auth, validation
│   ├── engine/                  ← Page rendering, section registry, transitions
│   ├── ui/                      ← Section components (hero, services, etc.)
│   └── analytics/               ← Analytics provider abstraction
├── jaostudio/                   ← Portfolio website (independent Next.js 15)
├── landingpage-demo/            ← Conversion-optimized landing system
├── commerce-demo/               ← E-commerce lifecycle
├── marketplace-demo/            ← Multi-vendor platform
├── content-platform-demo/       ← CMS + SEO engine
├── web-application-demo/        ← Multi-tenant project management SaaS
└── database-security-demo/      ← Secure B2B portal
```

## Shared Conventions

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion
- **Database:** Prisma + SQLite (each demo uses isolated `@prisma/{demo}-client`)
- **Auth:** NextAuth v5 (where needed)
- **State machines:** actor-guarded pure transition functions, event causation chains
- **Deployment:** Vercel (each demo independently deployable)

## Workspace Patterns

- Each demo has its own `package.json` with independent dependencies
- Shared code lives in `packages/*` and is referenced via workspace protocol (`@jaostudio/*`)
- Tailwind v4 `@source` directive in each demo's `globals.css` points to shared packages
- ESLint `no-restricted-imports` enforces public API boundaries

## State Machine Architecture

All 5 shared domain machines (payment, fulfillment, listing, content, booking) follow the same pattern:

```
types.ts     → State, Event, Context types
machine.ts   → MachineConfig definition via createMachine factory
transitions.ts → Pure transition function with actor guards
index.ts     → Barrel export
```

Transition functions are pure — they receive current state + event + actor context and return the next state. Callers handle side effects (DB writes, event emission).

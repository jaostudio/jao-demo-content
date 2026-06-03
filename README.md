# jaostudio · Monorepo Demo Catalog

Six production-system archetypes built on a shared platform monorepo with
`@jaostudio/core`, `@jaostudio/engine`, and `@jaostudio/ui`.

## Architecture

```
jaostudio
│
├── landingpage-demo      Marketing landing pages / vertical engine
├── commerce-demo         E-commerce product catalog + checkout
├── marketplace-demo      Two-sided vendor marketplace + moderation
├── content-platform-demo CMS / publishing platform with ISR
├── web-application-demo  Multi-tenant project management SaaS
└── database-security-demo Secure B2B portal with audit trails
│
shared packages
├── @jaostudio/core       State machines, events, auth, validation, rate limiting
├── @jaostudio/engine     Page rendering, section registry, transition variants
├── @jaostudio/ui         Section components (hero, services, testimonials, etc.)
└── @jaostudio/analytics  Analytics provider abstraction
```

### Architectural Principles

- **Engine defines contracts, not UI** — `@jaostudio/engine` specifies content types and
  registry interfaces. `@jaostudio/ui` provides the default component mapping.
  Apps can override the registry without touching shared packages.
- **State machines with actor guards** — Every transition function enforces
  actor-based permissions at the domain layer, not the UI layer.
- **Event causation chains** — All domain events carry `causationId` for full
  audit trail reconstruction across actor boundaries.
- **No abstraction before 2 demos** — Shared packages aren't modified for a
  single consumer. Extraction requires 2+ demos confirming the pattern.
- **Demonsume only public API paths** — No deep imports into `*/src/`.
  ESLint `no-restricted-imports` enforces this across all packages.

### State Machine Pattern

All 5 shared domain machines (payment, fulfillment, listing, content, booking)
follow the same architecture:

```
types.ts       → State, Event, Context types
machine.ts     → MachineConfig definition via createMachine factory
transitions.ts → Pure transition function with guard checks
index.ts       → Barrel export
```

The `transition*` functions are pure — they receive current state + event +
actor context and return the next state. Side effects (DB writes, event
emission) are handled by the caller.

### Quick Start

```bash
npm install
npm run build          # Build all 6 demos
npm run check:arch     # Run architecture validation
```

### Commands per Demo

Each demo has the same command set:

```bash
npm run dev --workspace=<demo-name>      # Development server
npm run build --workspace=<demo-name>    # Production build
npm run db:seed --workspace=<demo-name>  # Re-seed database
```

### Architecture Validation

```bash
npm run check:arch          # Dependency graph + machine tests + event tests
npm run check:deps          # Circular dependency detection (madge)
npm run check:machines      # State machine transition correctness
npm run check:events        # Event envelope + dispatch integrity
```

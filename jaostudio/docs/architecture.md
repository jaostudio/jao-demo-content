# Architecture

## Layer Ownership

| Layer                  | Responsibility                                    |
| ---------------------- | ------------------------------------------------- |
| `app/`                 | Routing, metadata, composition of sections        |
| `components/sections/` | Page-level presentation blocks                    |
| `components/ui/`       | Reusable primitives (button, card, container)     |
| `components/layout/`   | Shell components (navbar, footer, providers)      |
| `lib/`                 | Business/domain logic, data, types                |
| `config/`              | Immutable governance and configuration constants  |
| `docs/`                | Operational standards and policies                |
| `scripts/`             | QA tooling, CI helpers, automation                |
| `public/`              | Static assets — images, fonts, social cards       |

## Data Flow

- `lib/` is the single source of truth for all project data, SEO routes, CTA policy, and analytics schema.
- Pages `app/` import from `lib/` and pass data down to `components/sections/`.
- Sections never import project data directly — they receive it as props.
- UI primitives never import section or page data — they are fully generic.

## Motion Governance

- All animation durations, easings, and variants are defined in `src/lib/motion-variants.ts`.
- No hardcoded duration or easing values outside that file.
- `durations` object is re-exported from `motion-variants.ts` for consumer use.
- The cubic-bezier `[0.16, 1, 0.3, 1]` is the standard ease-out curve — defined once, imported everywhere.

## CTA Policy

- CTA labels and target routes are governed by `src/lib/cta-policy.ts`.
- Maximum one primary CTA per viewport.
- Available labels: `Start a Project`, `View Projects`, `Request an Audit`.
- All CTAs pass a `trackingLabel` prop for PostHog event capture.

## SEO Governance

- All routes are defined in `src/lib/seo-config.ts`.
- `sitemap.ts` and `robots.ts` derive from this config — never maintain a separate route list.
- Route hierarchy is explicit: `MarketingPage` vs `UtilityPage`.

## Analytics Governance

- Schema version (`ANALYTICS_SCHEMA_VERSION = 1`) is auto-injected into every event.
- `referrer` is captured as a fallback context field.
- PostHog is initialized with `advanced_disable_decide: true` — no feature flags, no surveys, no asset config fetch.
- Analytics must never break rendering: PostHog init is SSR-safe via `useState` + `useEffect`, with a no-op fallback when the key is absent.

## JSON-LD Pattern

- Shared `@id` constants live in `src/lib/json-ld-ids.ts`.
- All consumers (Organization, Person, Service, WebSite, BreadcrumbList) import from this file.
- Never hardcode `@id` strings inside JSON-LD components.

## CV Policy

- The CV page is a static narrative — not a live feed from the projects array.
- Curated project slugs are defined in `src/lib/cv-config.ts`.
- This prevents silent content drift when projects are added or reordered.

## Allowed Dependencies

### Runtime
- `framer-motion`
- `lucide-react`
- `posthog-js`
- `next/image`
- `next/font`
- `clsx` / `tailwind-merge`

### Restricted (require justification)
- Additional animation libraries
- State managers
- UI kits
- Analytics SDKs beyond PostHog
- CSS-in-JS systems

### Disallowed
- Multiple animation systems
- Duplicate analytics providers
- Runtime CSS frameworks
- Large component kits

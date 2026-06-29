# Feature Boundary Rules

## Core Rule

```
Feature-specific logic stays inside `features/<feature>`.
Shared primitives go into `components/ui` or `lib`.
No cross-feature imports unless intentional.
```

## Feature Structure

```
features/
  <feature>/
    components/    — Feature-specific components
    actions/       — Server actions (Next.js server actions or tRPC mutations)
    schemas/       — Zod / Valibot validation schemas
    queries/       — Data fetching functions or hooks
    types.ts       — Feature-specific TypeScript types
```

## Import Rules

```
✅ Allowed:  features/auth/components/LoginForm.tsx imports from components/ui/Button.tsx
✅ Allowed:  features/pricing/actions/submitQuote.ts imports from lib/db.ts
✅ Allowed:  features/pricing/components/QuoteForm.tsx imports from features/pricing/schemas/quoteSchema.ts
❌ Not allowed: features/pricing/components/QuoteForm.tsx imports from features/auth/components/LoginForm.tsx
❌ Not allowed: components/ui/Button.tsx imports from features/pricing/types.ts
❌ Not allowed: app/page.tsx directly imports from features/pricing/server/db.ts
```

## Shared Logic

When code needs to be shared across features:

```
1. Extract to `lib/` if it's a generic utility (db client, logger, rate limiter).
2. Extract to `components/ui/` if it's a visual primitive.
3. Extract to a shared `features/shared/` if it's feature-related but used by multiple features.
4. Do not duplicate code across features.
```

## Feature Independence

```
- Features should be independently developable.
- Removing a feature should not break other features.
- Feature-specific types are not exported outside the feature.
- Feature-specific API routes live under the feature.
```

## Exceptions

Cross-feature imports are allowed when:

```
1. An action in one feature needs to call a query in another feature (architectural approval required).
2. A layout component needs to render feature-specific UI via slot or render prop pattern.
3. Shared types are extracted to `features/shared/types.ts`.
```

## Refactoring Rule

When a feature boundary is violated during implementation:

```
1. Identify the violation (import path crossing feature boundary).
2. Move the shared logic to `lib/` or `components/ui/`.
3. Update all import paths.
4. Verify no circular dependencies.
5. Run typecheck and build.
```

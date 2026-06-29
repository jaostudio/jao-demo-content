# AGENTS.md

## Project

**jaostudio-platform** — Turborepo monorepo containing:

- 6 demo applications (commerce, content, security, landing, marketplace, web-app)
- `jaostudio` website
- 5 shared packages (`@jaostudio/core`, `@jaostudio/engine`, `@jaostudio/ui`, `@jaostudio/analytics`, `@jaostudio/config`)

Stack: Next.js, TypeScript, Prisma, Tailwind CSS, Playwright, Turborepo.
Package manager: `npm` (workspaces). Node: v22.

## Working rules

- Work within the relevant demo app — do not touch other apps or shared packages unless explicitly asked.
- Do not rewrite unrelated files.
- Do not introduce new dependencies without explaining why.
- Preserve existing design language and component conventions.
- Do not commit `.env`, `.env.local`, real secrets, tokens, or private credentials.
- Prefer small, reviewable PRs over broad rewrites.
- If requirements are ambiguous, inspect the codebase first and propose a plan.

## Build commands

Install: `npm install`
Dev: `npm run dev --workspace=<app-name>`
Build all: `npm run build`
Lint: `npm run lint`
Typecheck: `npx tsc --noEmit`

## Design QA

For UI changes, verify:

- desktop layout
- mobile layout
- empty/loading/error states
- accessible labels where relevant
- no placeholder copy
- no inconsistent colors
- no broken responsive behavior

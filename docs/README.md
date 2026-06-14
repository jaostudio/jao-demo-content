# Content Platform Demo

## Purpose
Content management and publishing platform with editorial workflow and SEO pipeline.

## Archetype Coverage
Content / Publishing — headless CMS, editorial workflow, SEO optimization, ISR.

## What's Built
- Author registration and admin dashboard with metric cards (draft/pending/published counts)
- Article CRUD with markdown editor, category + tag selection
- Content lifecycle: DRAFT → PENDING_REVIEW → PUBLISHED → ARCHIVED
- Role-based transitions: authors submit, admins approve/reject/archive
- Public article list + detail pages with ISR (revalidate: 60s)
- SEO pipeline: generateMetadata, JSON-LD structured data, OG tags, canonical URLs
- Content moderation: moderatedAt/moderatedById on every article
- Category pages with SSG
- Bilingual UI (English/Taglish) with locale switcher
- Dark/light mode with system preference and manual toggle
- RSS feed at /rss.xml
- Article version history with timeline view
- Comments stub on article detail pages
- Hard delete (admin-only) with confirmation
- Admin analytics dashboard
- Mobile drawer navigation
- Toast notifications for all actions

## Architecture
- Next.js 16 App Router, Prisma + SQLite, ISR for public pages
- @jaostudio/core/state-machines/content — transitionContent with actor-guarded content lifecycle
- @jaostudio/core/state-machines — contentMachine consumed without modification
- NextAuth v4 CredentialsProvider (JWT strategy)
- Zod validation on all inputs
- react-markdown with GFM for content rendering
- next-themes for dark mode
- next-intl for bilingual support

## Credentials
| Email | Role |
|---|---|
| sarah@content.dev | Author |
| marcus@content.dev | Author |
| admin@content.dev | Admin |

Password: `password123`

## Commands
```
npm run dev        # Start development server
npm run build      # Production build
npm run db:seed    # Re-seed database
npm run lint       # ESLint check
npm run db:reset   # Force-reset DB + re-seed
```

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

## Architecture
- Next.js 16 App Router, Prisma + SQLite, ISR for public pages
- @jaostudio/core/state-machines/content — transitionContent with actor-guarded content lifecycle
- @jaostudio/core/state-machines — contentMachine consumed without modification
- NextAuth v4 CredentialsProvider (same pattern as marketplace)
- ArticleVersion schema reserved (not wired)

## Credentials
| Email | Role |
|---|---|
| author1@content.dev | Author |
| author2@content.dev | Author |
| admin@content.dev | Admin |

Password: `password123`

## Commands
```
npm run dev        # Start development server
npm run build      # Production build
npm run db:seed    # Re-seed database
```

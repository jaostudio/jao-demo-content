# Likha — The Philippine Community Information Hub

> **Master Plan: Content Platform Demo → Professional Showcase**
> Brand: `jaostudio.dev` | Roles: Orchestrator, Engineer (DeepSeek V4), Design Auditor (Mimo V2.5), QA

---

## Table of Contents

1. [Vision & Branding](#1-vision--branding)
2. [Executive Summary of Changes](#2-executive-summary-of-changes)
3. [Architecture & Tooling Additions](#3-architecture--tooling-additions)
4. [Roles, Permissions & UI Differences](#4-roles-permissions--ui-differences)
5. [Phased Roadmap](#5-phased-roadmap)
6. [Testing & Validation Pipeline](#6-testing--validation-pipeline)
7. [Audit Workflows](#7-audit-workflows)
8. [Implementation & Writing Rules](#8-implementation--writing-rules)
9. [Seed Data & Demo Content Guidelines](#9-seed-data--demo-content-guidelines)

---

## 1. Vision & Branding

### Platform Identity

> **Likha** – The Philippine Community Information Hub
> *Create. Collaborate. Publish. In English or Taglish.*
> Built for barangays, schools, and organizations that need a reliable, bilingual, and modern content platform.

### What Likha Is

An **editorial content platform** for local governments, schools, and community organizations — not a social network, not a forum, not e-commerce, not a full LMS.

### What Likha Is Not

- **Not a social network** — No feeds, follows, likes, or algorithmic distribution
- **Not a forum** — Comments are simple and optional; no nested threads or reputation
- **Not an e-commerce platform** — No payments or product listings
- **Not a full LMS** — No quizzes, progress tracking, or certificates (though it can host learning content)

### Feature-to-Reality Mapping

| Feature | Real-world PH Use Case |
|---------|------------------------|
| Bilingual (English/Taglish) | Barangay announcements, school modules, NGO reports — reaching both professional and local audiences |
| Editorial workflow (Author → PENDING_REVIEW → Admin → PUBLISHED) | A teacher writes a lesson plan; the principal reviews; the division office approves |
| ISR + on-demand revalidation | Urgent typhoon advisory must appear instantly on the front page after approval |
| SEO & structured data | A local history article ranks on Google for "Philippine colonial churches" |
| Categories & tags | Filter by "Education", "Health", "Infrastructure", "Culture", "Announcement" |
| Markdown + image uploads | Teachers embed diagrams, NGOs post infographics, LGUs upload maps |
| Version history | Track revisions of a municipal ordinance or a school curriculum guide |
| Comments (stub) | Residents ask questions under a garbage collection schedule post |
| Role-based auth (Author, Admin) | Barangay secretary (Author) drafts, Mayor's office (Admin) approves |
| RSS feed | Local news aggregators pull updates automatically |
| Dark/light mode | Evening readers in remote areas with low battery prefer dark mode |
| Analytics stub (cache hits, revalidation logs) | Demonstrate performance for low-bandwidth, high-traffic scenarios |
| Hard delete + archive | Remove outdated emergency notices or retain archived ordinances |
| Mobile drawer navigation | Many users in PH access via budget Android phones |

### Demo Personas

| Persona | Role | Uses Likha for… |
|---------|------|----------------|
| Maria (Barangay Secretary) | Author | Draft announcements about clean-up drives, vaccination schedules |
| Jose (School Principal) | Admin | Approve lesson plans submitted by teachers, publish to parents |
| Ate Nena (Resident) | Reader (public) | Read in Taglish, comment to ask clarification, share on Facebook |
| Kuya Ben (NGO Worker) | Author + occasional Admin | Publish livelihood training updates, manage volunteer contributors |

---

## 2. Executive Summary of Changes

| Area | Current State | Target State |
|------|---------------|--------------|
| **Type safety** | `as any` everywhere | Fully typed Prisma client + Zod schemas |
| **ISR** | Only time-based (60s) | Time + on-demand after any state change |
| **User feedback** | Silent failures / raw errors | Toast notifications + form validation + error boundaries |
| **Mobile navigation** | No sidebar on mobile | Drawer menu + bottom nav bar |
| **Markdown** | Naive regex parser | `react-markdown` + syntax highlighting + image support |
| **Bilingual** | None | `next-intl` with English / Taglish (code-switched) |
| **Dark mode** | Classes exist, no toggle | `next-themes` + system preference + manual toggle |
| **Asset handling** | No images | `next/image` + cover photos + author avatars (with upload) |
| **Feature showcase** | Basic CRUD | Full editorial timeline, version preview, delete, analytics dashboard, RSS feed, comment stubs |

---

## 3. Architecture & Tooling Additions

### Packages to Add

```
zod                          # Validation
react-hook-form              # Form handling
@hookform/resolvers          # Zod integration with RHF
react-markdown               # Markdown rendering
remark-gfm                   # GFM tables, strikethrough
rehype-highlight             # Syntax highlighting
next-intl                    # i18n
next-themes                  # Dark mode
sonner                       # Toast notifications
@radix-ui/react-dialog       # Modal/drawer primitives
react-swipeable              # Swipe gestures for mobile drawer
sharp                        # Image optimization (built-in with next/image)
uploadthing                  # Image uploads (or local public/uploads)
```

### Folder Structure (Post-Restructure)

```
src/
  app/
    [locale]/                 # i18n routing
      (auth)/                 # signin, register
      admin/                  # Admin dashboard
      articles/               # Public article pages
      category/               # Category pages
    api/                      # API routes (no locale)
    rss.xml/                  # RSS feed route
    layout.tsx                # Root layout with providers
    page.tsx                  # Redirect to default locale
  components/
    ui/                       # Reusable primitives (button, card, dialog, sheet)
    theme-toggle.tsx
    locale-switcher.tsx
    mobile-drawer.tsx
    article-card.tsx
    json-ld.tsx
    status-badge.tsx
    transition-buttons.tsx
    header.tsx
    provider.tsx
  i18n/
    request.ts
    navigation.ts
    messages/
      en.json
      tl.json
  lib/
    actions/
      articles.ts             # Server actions (create, update, delete)
    auth/
      auth.ts                 # NextAuth config
      getSession.ts           # Session helpers
    validations/
      article.ts              # Zod schemas
      auth.ts                 # Auth schemas
    revalidation.ts           # Centralised revalidatePath helper
    prisma.ts                 # Prisma client singleton
```

---

## 4. Roles, Permissions & UI Differences

### 4.1 Role Overview

| Role | Internal Name | Typical Persona | Count in Seed |
|------|---------------|----------------|---------------|
| Reader | (unauthenticated) | Resident, visitor, search engine | N/A |
| Author | `AUTHOR` | Barangay secretary, teacher, NGO field officer | 2 |
| Admin | `ADMIN` | Barangay captain, school principal, NGO director | 1 |

### 4.2 Permission Matrix

| Action | Reader | Author | Admin |
|--------|--------|--------|-------|
| View published articles | ✅ | ✅ | ✅ |
| View article detail (published) | ✅ | ✅ | ✅ |
| View article detail (draft / pending / archived) | ❌ | ✅ (own only) | ✅ (all) |
| List own articles in admin | N/A | ✅ | ✅ |
| List all articles in admin | N/A | ❌ | ✅ |
| Create article | ❌ | ✅ | ✅ |
| Edit own article (DRAFT only) | ❌ | ✅ | ✅ (any draft) |
| Edit own article (PENDING_REVIEW) | ❌ | ❌ (blocked) | ✅ |
| Edit any article (any status) | ❌ | ❌ | ✅ |
| Delete own article (hard delete) | ❌ | ❌ (archive only) | ✅ (any) |
| Archive own article | ❌ | ✅ (own, any except archived) | ✅ (any) |
| Submit own article for review (DRAFT → PENDING_REVIEW) | ❌ | ✅ | ✅ |
| Approve article (PENDING_REVIEW → PUBLISHED) | ❌ | ❌ | ✅ |
| Reject article (PENDING_REVIEW → DRAFT) | ❌ | ❌ | ✅ |
| Archive article (PUBLISHED → ARCHIVED) | ❌ | ❌ (only own PUBLISHED → ARCHIVED) | ✅ (any) |
| Restore from archive (ARCHIVED → DRAFT) | ❌ | ❌ | ✅ |
| Manage categories (CRUD) | ❌ | ❌ | ✅ |
| Manage tags (CRUD) | ❌ | ❌ | ✅ |
| Manage users (view, promote, delete) | ❌ | ❌ | ✅ |
| Access admin dashboard | ❌ | ✅ (limited) | ✅ (full) |
| View analytics / cache metrics | ❌ | ❌ | ✅ |
| View version history of any article | ❌ | ✅ (own only) | ✅ (all) |
| Comment on published articles (stub) | ✅ | ✅ | ✅ |
| RSS feed access | ✅ | ✅ | ✅ |

### 4.3 UI Differences by Role

#### Header (Public Pages)

| Element | Reader | Author | Admin |
|---------|--------|--------|-------|
| Logo (Likha) | ✅ | ✅ | ✅ |
| Theme toggle | ✅ | ✅ | ✅ |
| Locale switcher | ✅ | ✅ | ✅ |
| "Admin" link | ❌ | ✅ | ✅ |
| "Create Article" button | ❌ | ✅ | ✅ |
| Sign in / Sign out | ✅ (sign in) | ✅ (avatar + sign out) | ✅ (avatar + sign out) |

#### Admin Sidebar

| Menu Item | Author | Admin |
|-----------|--------|-------|
| Dashboard | ✅ (limited) | ✅ (full) |
| Articles | ✅ (own only) | ✅ (all, with filters) |
| Categories | ✅ (read-only list) | ✅ (CRUD) |
| Tags | ✅ (read-only list) | ✅ (CRUD) |
| Users | ❌ | ✅ |
| Analytics | ❌ | ✅ |
| Settings | ❌ | ✅ (placeholder) |

#### Article Edit Page

| Field / Action | Author (own DRAFT only) | Admin (any article) |
|----------------|------------------------|---------------------|
| Title, content, excerpt, category, tags | ✅ (editable) | ✅ (editable) |
| Status dropdown | ❌ (fixed DRAFT) | ✅ (can change directly) |
| Submit for Review button | ✅ | N/A (uses status dropdown) |
| Delete button | ❌ | ✅ (red, confirmation) |
| Version history link | ✅ (read-only) | ✅ (full timeline) |

#### Transition Buttons Logic

- **If `role === 'ADMIN'`**: Show all allowed transitions for that status
- **If `role === 'AUTHOR'`**: Show only `submit` (if DRAFT) or `archive` (if PUBLISHED) — and only if `article.authorId === session.user.id`
- Admin buttons: prominent (primary for Approve, warning for Reject, danger for Delete)
- Author buttons: smaller and muted
- Feedback: Toast on success/error; confirmation dialog for destructive actions (archive, reject, delete)

---

## 5. Phased Roadmap

### Phase 0 — Foundation Fix (2 days)

**Focus:** Critical stability & type safety

| Deliverable | Details |
|-------------|---------|
| Remove all `as any` from Prisma calls | Regenerate client, import correct types, alias in tsconfig if needed |
| Add Zod schemas for all inputs | `src/lib/validations/article.ts`, `auth.ts` — validate before every DB write |
| Fix ISR revalidation in transition API | Call `revalidatePath` for `/`, `/articles/[slug]`, `/category/[slug]`, `/admin` after every transition |
| Replace raw `throw` with structured error returns | Server actions return `{ success, data?, error? }`; client shows toast |
| Centralised revalidation helper | `src/lib/revalidation.ts` — single function for article path revalidation |

### Phase 1 — UX & Mobile (3 days)

**Focus:** User feedback, navigation, markdown

| Deliverable | Details |
|-------------|---------|
| Toast notifications | Install `sonner`; call after every action (create, update, transition) |
| Loading & error boundaries | `loading.tsx` (skeleton) and `error.tsx` (retry) for all route groups |
| Mobile drawer | Radix `Sheet` + `react-swipeable`; replaces `hidden md:block` sidebar |
| Confirmation dialogs | Radix `AlertDialog` for archive, reject, delete, restore |
| Full `react-markdown` | With `remark-gfm` (tables) and `rehype-highlight` (syntax highlighting) |
| Block editing of PENDING_REVIEW articles | Guard in `edit/page.tsx` — redirect with error if author tries |

### Phase 2 — Bilingual & Dark Mode (2 days)

**Focus:** i18n + theming

| Deliverable | Details |
|-------------|---------|
| next-intl integration | Create `src/i18n/request.ts`; wrap layout with `NextIntlClientProvider` |
| Locale switcher | In header + mobile drawer |
| English locale file | `src/i18n/messages/en.json` — all UI strings |
| Taglish locale file | `src/i18n/messages/tl.json` — natural code-switched Taglish |
| next-themes integration | Add `ThemeProvider`; create `ThemeToggle` (Sun/Moon) |
| Dark mode polish | Tailwind `class` strategy; system preference + manual toggle + localStorage |

### Phase 3 — Feature Showcase (4 days)

**Focus:** All "client expected" features

| Deliverable | Details |
|-------------|---------|
| Article version history | Populate `ArticleVersion` table on every update; display timeline in admin |
| Hard delete | "Delete permanently" button (admin only); confirmation dialog |
| Cover images | Add `image` field to `Article` schema; use `uploadthing` or local `public/uploads`; display with `next/image` |
| Author avatars | Use `next/image` on existing `image` field; provide default avatar |
| RSS feed | `src/app/rss.xml/route.ts` — returns `application/rss+xml` with latest published articles |
| Comments stub | New `Comment` table; simple form on article detail (name, email, body); no moderation |
| Admin analytics dashboard | ISR cache hit ratio, last revalidation timestamp, total articles per status, recent revalidation paths |
| SEO dashboard | Preview `generateMetadata` output in admin (OG tags, JSON-LD preview) |

### Phase 4 — Polish & Hardening (2 days)

**Focus:** Security, performance, docs

| Deliverable | Details |
|-------------|---------|
| Rate limiting on auth endpoints | `/api/register` — 5 req/min per IP (in-memory with `lru-cache` or `upstash/ratelimit`) |
| Password strength validation | Zod refinement: min 8 chars, at least one number |
| Fix seed/doc mismatches | Update `docs/README.md` with correct emails (`sarah@content.dev`, `marcus@content.dev`) |
| Lighthouse scores ≥ 90 | Performance, Accessibility, SEO, Best Practices |
| Update README | Include "Known quirks" section, correct credentials, architecture overview |
| API docs stub | Swagger/OpenAPI or markdown-based endpoint reference |

### Phase 5 — Deployment & Demo (1 day)

**Focus:** Live showcase

| Deliverable | Details |
|-------------|---------|
| Deploy to Vercel / Netlify | Configure production env vars, domain |
| Seed production DB | Realistic PH content (barangay announcements, school modules) |
| Demo video | Walkthrough of all role views (Reader, Author, Admin) |
| Client presentation deck | Screenshots, feature list, architecture diagram |

**Total estimated effort:** 14 working days (3 weeks) for single engineer + auditor.

---

## 6. Testing & Validation Pipeline

### 6.1 Testing Pyramid

| Level | Tool | Scope | Where Run |
|-------|------|-------|-----------|
| **Unit** | Vitest + React Testing Library | Zod schema validation, permission helpers (canEdit, canDelete), utility functions | Local & CI |
| **Integration** | Vitest + `@testing-library/react` + `msw` | Server actions (create, update, transition), API routes (transition, register), DB access patterns | Local & CI |
| **E2E** | Playwright | Critical user journeys — Reader: view home → article → comment; Author: create → submit → see pending; Admin: approve → verify published; Mobile: drawer navigation, theme toggle; Bilingual: switch locale, text changes | CI (nightly) & pre-deploy |

### 6.2 Continuous Integration (GitHub Actions)

```yaml
name: Likha CI

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check      # tsc --noEmit
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run build            # Next.js build (checks ISR, routes)
      - run: npm run db:seed          # Seed fresh test DB
      - run: npm run test:e2e         # Playwright (headless)
      - run: npm run lighthouse:ci
```

### 6.3 PR Validation Checklist

| # | Check | Automated | Manual |
|---|-------|-----------|--------|
| 1 | TypeScript no errors (including no `any`) | ✅ | |
| 2 | All tests pass (unit + integration + e2e) | ✅ | |
| 3 | No new accessibility violations (axe-core) | ✅ | |
| 4 | Lighthouse scores (Perf, A11y, SEO) ≥ 90 | ✅ | |
| 5 | Code coverage > 80% for critical paths | ✅ | |
| 6 | Review by another developer | | ✅ |
| 7 | Design audit (Mimo V2.5) | | ✅ |

### 6.4 Staging Validation (Post-Deploy)

After merge to `main`, auto-deploy to `staging.likha.jaostudio.dev` and run:

- Smoke test: homepage loads, login works for all roles
- Revalidation test: publish article, confirm it appears on homepage within 2 seconds
- Bilingual test: switch locale, verify all static strings change
- Mobile test: Playwright device emulation (iPhone 12, Pixel 5)
- Dark mode test: toggle, check contrast with WCAG colour tool
- DB migration test: run `prisma migrate deploy` on fresh replica

---

## 7. Audit Workflows

### 7.1 Design Audit (Mimo V2.5)

**Frequency:** End of Phase 4; before any major feature addition

| Audit Area | Checklist | Tool / Method |
|------------|-----------|---------------|
| Visual consistency | Colour palette (teal + amber) matches spec; typography (Inter, Source Serif) correct; spacing follows 8px grid; buttons, cards, form elements consistent | Manual + browser inspector |
| Responsive design | Mobile (375px): no horizontal scroll, drawer works, bottom nav present; Tablet (768px): sidebar collapses; Desktop (1280px): full layout | Chrome DevTools device emulation |
| Dark mode | Dark background (#0F172A) applied; text contrast ≥ 4.5:1 on interactive elements; images/icons have dark variants | WCAG contrast checker + manual |
| Accessibility | Keyboard navigable; ARIA labels on icon buttons; focus indicators visible; alt text on images | axe DevTools + manual keyboard test |
| Micro-interactions | Hover states on buttons; loading skeletons smooth, no layout shift; toasts appear top-right, auto-dismiss | Manual |
| Bilingual layout | Taglish text fits within buttons; locale switcher toggles without page reload; no overflow | Manual + Playwright |

**Output:** Report with screenshots, violation list, severity (Critical/High/Medium/Low). Critical must be fixed before release.

### 7.2 Feature Audit (Against Requirements Matrix)

All 18 client-facing features must pass manual testing. Template:

| # | Feature | Test Case | Pass/Fail | Notes |
|---|---------|-----------|-----------|-------|
| 1 | Role-based publishing workflow | Author creates → submits → Admin approves → published | ✅ | |
| 2 | Real-time content updates | Admin approves; homepage updates in <2s (ISR on-demand) | ✅ | |
| 3 | SEO-first architecture | Meta tags, JSON-LD, OG tags on article detail | ✅ | |
| 4 | Bilingual | Toggle to Taglish; all strings change; article content unchanged | ✅ | |
| 5 | Mobile-friendly | Mobile drawer; all actions accessible | ✅ | |

**Acceptance:** All 18 features must pass. File bug for failures; schedule fix in next sprint.

### 7.3 Performance & Security Audit

| Check | Threshold | Automated? |
|-------|-----------|------------|
| FCP | < 1.5s (mobile 3G) | ✅ (Lighthouse) |
| LCP | < 2.5s | ✅ |
| TTI | < 3.5s | ✅ |
| CLS | < 0.1 | ✅ |
| Bundle size (initial) | < 200KB JS+CSS | ✅ |
| `npm audit` | 0 high/critical | ✅ |
| Rate limiting | 5 req/min per IP on `/api/register` | Manual |
| SQL injection / XSS | None (Prisma + React escapes) | Manual + ZAP |

### 7.4 UAT Script (Per Persona)

**Maria (Author):**
1. Log in as `sarah@content.dev` / `password123`
2. Create new article (title, content in Taglish, assign category "Barangay")
3. Save as draft → see in "My Articles"
4. Submit for review → status changes to PENDING_REVIEW
5. Try to edit — should be blocked with error toast
6. Log out

**Jose (Admin):**
1. Log in as `admin@content.dev`
2. Go to Admin → Articles → Filter "Pending Review"
3. Open Maria's article → Click "Approve" → Confirm
4. Visit public homepage → article appears instantly
5. Go to Users → Promote another author to admin → test

**Success criteria:** All steps complete without errors or unexpected UI.

### 7.5 Audit Workflow Integration

```mermaid
graph TD
    A[Dev completes feature] --> B[Run local tests + lint]
    B --> C[Create PR]
    C --> D{CI passes?}
    D -- No --> E[Fix & push]
    E --> C
    D -- Yes --> F[Request design audit (Mimo)]
    F --> G{Design issues?}
    G -- Yes --> H[Fix UI]
    H --> C
    G -- No --> I[Request feature audit (QA)]
    I --> J{All features pass?}
    J -- No --> K[File bug ticket]
    K --> C
    J -- Yes --> L[Merge to main]
    L --> M[Deploy to staging]
    M --> N[Run post-deploy validation]
    N --> O{Pass?}
    O -- No --> P[Rollback & hotfix]
    P --> C
    O -- Yes --> Q[Deploy to production]
```

---

## 8. Implementation & Writing Rules

### 8.1 Code & Architecture — Avoid "AI Slop"

**✅ Do:**
- Write consistent, meaningful variable names that reflect domain (`article.status` not `as`)
- Include comments that explain **why**, not *what* (especially for non-obvious business rules)
- Use small, focused functions (max ~30 lines) with clear single responsibility
- Keep error messages helpful and specific: *"You cannot edit a pending review — ask an admin"*
- Write tests that read like user stories: `test("author cannot edit article under review")`

**❌ Avoid:**
- Over-engineering: no unnecessary abstractions, generic repositories, or "just in case" patterns
- Copy-pasted AI comments like `// This function handles the submission of an article for review`
- Perfectly symmetrical code — human code has small variations (spacing, line breaks)
- Large, generic try-catch blocks that swallow errors
- Inconsistent formatting (use Prettier, but allow occasional human line breaks for readability)

### 8.2 Content & Copy — Sound Human

**✅ Do:**
- Use contractions (`don't`, `you'll`, `it's`)
- Vary sentence length — mix short, punchy lines with longer, thoughtful ones
- Address the user directly: *"You can archive old announcements to keep your feed clean"*
- Include minor imperfections naturally: slightly informal phrase, exclamation mark, rhetorical question
- For Taglish: use real code-switching patterns — *"I-click ang 'Submit' para ma-review ng admin"*

**❌ Avoid:**
- Overly polished marketing language: *"Revolutionising community content management…"*
- Repeated generic phrases across pages: *"Welcome to our platform"* on every dashboard
- Robotic error messages: *"An error has occurred. Please try again later."* → instead: *"Oops, something went wrong while saving. Check your connection? [Retry]"*
- Unsolicited "tips" that sound like an LLM wrote them

### 8.3 UI/UX Design — Hide the "Template" Feel

**✅ Do:**
- Add subtle irregularities in layout (not every card has identical text length)
- Use realistic placeholder content — typos, informal language, emojis (👍, 🇵🇭), varied dates
- Provide empty states that feel helpful, not corporate: *"No articles yet. Click 'Create' — we'll wait."*
- Use consistent but not rigid spacing — 8px grid as a guide, allow 12px where it feels right
- Show loading skeletons that mimic final content shape, not generic grey rectangles

**❌ Avoid:**
- Perfectly centred everything — real designers leave breathing room and asymmetry
- Overuse of gradients, glassmorphism, or modern AI-favoured effects
- Identical card heights when content length varies (unless explicitly truncated)
- Stock photos — use Unsplash with real Filipino faces and settings
- Mixed icon sets — stick to one (Lucide)

### 8.4 Typography & Colour

**✅ Do:**
- Use system fonts as fallback (`Inter, -apple-system, BlinkMacSystemFont`)
- Set line-height to `1.6` for body text
- Allow long words to break naturally (`overflow-wrap: break-word`)
- Choose colours with purpose: teal for calm trust, amber for energy

**❌ Avoid:**
- Pure black `#000` on white — use off-white (`#fafafa`) and dark slate (`#0f172a`)
- Overly rounded corners (`rounded-full` on everything looks like a toy)
- Same shade for primary and secondary buttons — differentiate clearly

### 8.5 Interactivity & Micro-copy

**✅ Do:**
- Toast messages with a human voice: *"Article approved! It's now live."*
- Confirmation dialogs with humour: *"Archive this? Don't worry, you can restore it later."*
- Form field validation inline with friendly messages, not just red asterisks

**❌ Avoid:**
- Over-animating — no bouncing, spinning, or fading on every click
- Generic success modals that block the user (use toasts)
- "AI-powered" badges unless you actually have an AI feature

### 8.6 Performance & Accessibility

**✅ Do:**
- Lazy load images with explicit `width`/`height` to avoid layout shift
- Preconnect to important origins (fonts, upload service)
- Ensure 4.5:1 contrast on all text — test with real eyes, not just tools
- Add `:focus-visible` styles that are visible but not ugly

**❌ Avoid:**
- Blocking rendering with large third-party scripts
- Auto-playing media — ever
- Loading hundreds of KB of icons (use a small set or sprite)

### 8.7 Bilingual Writing (English/Taglish) — Authenticity Rules

**✅ Do:**
- Use natural code-switching: nouns/verbs in English, connecting words/particles in Tagalog
  - *"I-click ang 'Submit' para ma-review ng admin."* ✅
  - *Not: "I-submit para sa review ang artikulo."* ❌ (unnatural word order)
- Keep UI labels short — Taglish can be longer, so allow flexible button widths
- Add English-only tooltips if Taglish might confuse (but demo assumes Filipino audience)

**❌ Avoid:**
- Direct translation of every English word — it sounds robotic
  - *"Submit for review" → "Ipasa para sa pagsusuri"* ❌ (too formal)
  - *"I-submit for review"* ✅
- Mixing formal Tagalog (`po`, `opo`) unless character demands it
- Inconsistency — maintain a glossary for the demo

### 8.8 Documentation & Commit Messages

**✅ Do:**
- README should include a "Known quirks" section — shows honesty and attention to detail
- Use screenshots with real content, not mockups with "Lorem ipsum"
- Write commit messages that tell a story: `fix: prevent editing pending articles — author was confused`
- Keep commit messages narrative with context, not just `fix` / `update`

**❌ Avoid:**
- Over-explaining basic features ("Click the edit button to edit")
- Promising features that don't exist ("AI content recommendations")
- Using the same phrasing in docs as in the UI — docs should expand, not repeat

### 8.9 Pre-Merge Human-Centric Review Checklist

- [ ] Does the code feel overly symmetrical or pattern-driven? (Refactor if yes)
- [ ] Are error messages helpful and slightly informal?
- [ ] Does the UI have imperfect but charming real content?
- [ ] Are there no AI-generated comments like "This function is responsible for…"?
- [ ] Does dark mode actually look good (not just inverted colours)?
- [ ] Would a non-technical barangay secretary understand the UI without training?

### Summary Table — Dos & Don'ts

| Aspect | ✅ Do (human) | ❌ Avoid (AI-like) |
|--------|--------------|--------------------|
| Code comments | Explain *why*, be concise | Explain obvious *what* |
| Error messages | Conversational, specific | Generic, robotic |
| UI spacing | 8px grid + occasional deviations | Perfectly rigid alignment |
| Content | Typos, varied lengths, local references | Lorem ipsum, identical blocks |
| Bilingual | Natural code-switching | Direct translation |
| Commit messages | Narrative, context | `fix` / `update` only |

---

## 9. Seed Data & Demo Content Guidelines

### ✅ Do
- Write seed content as if a real barangay secretary or teacher wrote it:
  - *"Bukas ng umaga, magkakaroon ng libreng bakuna sa health center. Bring your ID and vaccination card."*
  - *"Grade 6 Math module: Fractions. Bawal mag-copy ng sagot ha?"*
- Include typos or informal punctuation intentionally (one or two per 500 words)
- Use real dates — past, present, future. Mix published and scheduled content
- Add comments that look like real residents: *"Salamat dito! Kelan next session?"*

### ❌ Avoid
- Perfect grammar in every user-generated field (comments, article excerpts)
- All articles published on the same timestamp — spread over weeks
- No author photos — use generated avatars or Unsplash with captions

---

## Appendices

### A. Key Code Snippets

#### Centralised Revalidation Helper

```ts
// src/lib/revalidation.ts
import { revalidatePath, revalidateTag } from 'next/cache'

export function revalidateArticlePaths(article: { slug: string; category: { slug: string } }) {
  revalidatePath('/')
  revalidatePath(`/articles/${article.slug}`)
  revalidatePath(`/category/${article.category.slug}`)
  revalidatePath('/admin')
  revalidateTag('articles')
}
```

#### Mobile Drawer Component (Concept)

```tsx
'use client'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

export function MobileDrawer() {
  return (
    <Sheet>
      <SheetTrigger><Menu /></SheetTrigger>
      <SheetContent side="left">
        <nav className="flex flex-col gap-4 mt-8">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/articles">Articles</Link>
          <LocaleSwitcher />
          <ThemeToggle />
        </nav>
      </SheetContent>
    </Sheet>
  )
}
```

#### Bilingual Middleware (Concept)

```ts
// src/middleware.ts
import createMiddleware from 'next-intl/middleware'
export default createMiddleware({ locales: ['en', 'tl'], defaultLocale: 'en' })
```

### B. English / Taglish Locale Examples

**en.json:**
```json
{
  "roles": { "author": "Author", "admin": "Admin", "reader": "Reader" },
  "actions": {
    "submit_for_review": "Submit for Review",
    "approve": "Approve",
    "reject": "Reject",
    "archive": "Archive",
    "restore": "Restore",
    "delete_permanently": "Delete Permanently"
  },
  "errors": { "cannot_edit_pending": "You cannot edit an article under review. Ask an admin." }
}
```

**tl.json:**
```json
{
  "roles": { "author": "Author (Manunulat)", "admin": "Admin (Tagapamahala)", "reader": "Reader (Mambabasa)" },
  "actions": {
    "submit_for_review": "I-submit for review",
    "approve": "Aprubahan",
    "reject": "I-reject",
    "archive": "I-archive",
    "restore": "I-restore",
    "delete_permanently": "Burahin nang permanente"
  },
  "errors": { "cannot_edit_pending": "Hindi mo ma-edit ang artikulong nasa review. Makipag-ugnayan sa admin." }
}
```

### C. Implementation Notes for the Engineer

1. **Session object** must include `role` and `id`. Extend NextAuth types.
2. **Middleware** protects routes: `/admin` → requires auth; `/admin/users`, `/admin/analytics` → require `role === 'ADMIN'`.
3. **Server actions** check `session.user.role` and `article.authorId` before mutations.
4. **UI components** use `useSession()` for role; conditional rendering on client side only for visual elements (no sensitive data exposure).
5. **Seed data** should assign each article an `authorId` (one of two authors or admin). Admin also has own articles for testing.

---

## Responsibility Matrix

| Role | Responsibility |
|------|----------------|
| **Orchestrator** | Owns roadmap, approves phase transitions, ensures alignment with Likha brand |
| **Engineer (DeepSeek V4)** | Implements code per roadmap, writes tests, fixes bugs, keeps CI green |
| **Design Auditor (Mimo V2.5)** | Runs design audit checklists, reports violations, validates dark mode & responsiveness |
| **QA** | Executes feature audit, UAT scripts, performance/security scans |

---

*Last updated: 2026-06-10*

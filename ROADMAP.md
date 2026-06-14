# Likha — Prioritized Roadmap

> **2–3 Week Sprint** | Kalinaw Design System + Visual Block Editor + Collaborative Features

---

## Phase 1: Visual Block Editor & Live Preview (7 days)

**Goal:** Replace plain Markdown `<textarea>` with drag-and-drop block editing. Authors can *see* their content as they build it.

| Day | Deliverable | Files |
|-----|-------------|-------|
| 1 | Block type definitions + Zod schema + helper utilities | `src/lib/block-editor/types.ts` |
| 1 | Block renderers (heading, paragraph, image, button, columns, callout, divider) | `src/components/block-editor/blocks/*.tsx` |
| 2 | `BlockRenderer` switch component + `ArticleContent` public entry point | `src/components/block-editor/block-renderer.tsx`, `public/article-content.tsx` |
| 2 | `InlineEditor` (contentEditable wrapper) + `ImagePicker` (URL input) | `src/components/block-editor/editor/inline-editor.tsx`, `image-picker.tsx` |
| 3 | `@dnd-kit` integration: SortableBlock + BlockWrapper + BlockToolbar | `src/components/block-editor/editor/sortable-block.tsx`, `block-wrapper.tsx`, `block-toolbar.tsx` |
| 3–4 | Full `BlockEditor` assembly, wire into `article-form.tsx` (replace textarea) | `src/components/block-editor/block-editor.tsx`, `src/app/admin/articles/article-form.tsx` |
| 4 | Wire `ArticleContent` into public pages (new + legacy paths) | `src/components/new/pages/article-detail.tsx`, `src/app/articles/[slug]/page.tsx` |
| 4 | Extend Zod schema + server action validation | `src/lib/validations/article.ts`, `src/lib/actions/articles.ts` |
| 5 | **Live Preview** — side-by-side editor + preview pane in admin | `src/components/block-editor/editor/live-preview.tsx` |
| 5 | **Content Map stub** — visual graph showing article → channels | `src/components/admin/content-map.tsx` |
| 6–7 | Polish: empty states, block hover controls, keyboard shortcuts, mobile touch | Various |
| 7 | **Build + lint verification** — 0 errors, 0 warnings | — |

**🎯 Demo milestone:** Create an article with heading, image, callout, and button blocks. See it render identically on the public page. Reorder blocks by drag-and-drop.

**Dependencies added:** `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`

---

## Phase 2: Collaboration Features (5 days)

**Goal:** Turn the admin from a solo writing tool into a team workspace.

| Day | Deliverable | Details |
|-----|-------------|---------|
| 1 | **Field-level comments** — comment on any block with @mentions | New `CommentBlock` model or denormalized JSON in article; UI as thread sidebar |
| 2 | Comment threads UI — reply, resolve, show/hide resolved | Accordion-style threads per block; badge count in editor |
| 3 | **Activity feed** — timeline of who changed what, when | New `ActivityLog` model (articleId, userId, action, timestamp, metadata) |
| 4 | Activity feed UI — timeline component in admin sidebar | Scrollable feed with avatars, action text, relative timestamps |
| 4 | **Approval chain visualization** — show PENDING_REVIEW → PUBLISHED path with reviewer | Visual step indicator in admin article header |
| 5 | Notifications badge on admin header | Simple count of unread comment @mentions + pending actions |

**🎯 Demo milestone:** Author writes article → adds comment on a heading → @mentions admin → admin sees notification → resolves comment → approves.

**Dependencies added:** None (use existing Prisma + sonner)

---

## Phase 3: Analytics & Developer Features (5 days)

**Goal:** Give admins editorial intelligence, give developers self-serve APIs.

| Day | Deliverable | Details |
|-----|-------------|---------|
| 1 | **Content performance dashboard** — page views, top articles, views by category | Track via ISR cache hits + simple page-view counter model |
| 2 | Performance dashboard UI — trend chart (CSS-only), top-10 list, category breakdown | CSS bar charts (no recharts), sortable table |
| 3 | **Trending topics** — articles with most views/comments in last 7 days | SQL query on page views + comment count; display in admin + public sidebar |
| 4 | **Webhooks on publish** — POST to configured URL when article → PUBLISHED | New `Webhook` model (url, events), server action on transition |
| 4 | Webhook UI — CRUD in admin settings | Simple form + test button |
| 5 | **TypeScript types export** — auto-generate `.d.ts` from Prisma schema | Script + npm command; documentation in README |

**🎯 Demo milestone:** Admin publishes article → webhook fires (visible in logs) → analytics dashboard shows view count → trending sidebar updates.

**Dependencies added:** None (use existing Prisma)

---

## Phase 4: Enterprise & Polish (3 days)

**Goal:** Dark mode refinements, i18n coverage, accessibility, deployment hardening.

| Day | Deliverable | Details |
|-----|-------------|---------|
| 1 | **Audit log viewer** — searchable "who did what to which article" | New `AuditLog` model; admin-only page with search/filter |
| 1 | Dark mode refinements — block editor, comment threads, analytics | Verify all new components have `dark:` variants |
| 2 | i18n coverage — all new Phase 1–3 UI strings internationalized | Update `en.json` / `tl.json` with block editor, comments, analytics keys |
| 2 | WCAG AA audit — keyboard nav, focus indicators, color contrast | axe DevTools pass; manual tab-through for block editor |
| 3 | Lighthouse ≥ 90 — performance, accessibility, SEO, best practices | Image lazy-loading, preconnect, semantic HTML audit |
| 3 | Final seed data update — realistic PH content with Unsplash Filipino scene covers | 12+ articles across categories with proper images |

**🎯 Demo milestone:** Lighthouse ≥ 90, full keyboard navigation, dark mode for all new features, complete Taglish strings.

---

## Summary Timeline

```
Week 1:  ████████████████░░░░░░░░  Phase 1 (Block Editor + Preview)
Week 2:  ░░░░░░░░████████████░░░░  Phase 2 (Collaboration)
Week 3:  ░░░░░░░░░░░░░░██████████  Phase 3 (Analytics + Webhooks)
         ░░░░░░░░░░░░░░░░░░░░████  Phase 4 (Polish + Audit)
```

**Total:** ~20 days (4 weeks) for single engineer

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| `@dnd-kit` conflicts with React 19 / Turbopack | Low | High | Pin to compatible version; test immediately |
| `contentEditable` behavior differs across browsers | Medium | Medium | Use `onInput` + `onBlur`; test on Chrome + Firefox + Edge |
| Block editor feels slow with 50+ blocks | Low | Low | Virtualize list if needed (unlikely for articles) |
| Server action payload too large (>1MB JSON) | Low | Medium | Set `maxDuration`; add client-side size warning |
| Legacy markdown→block migration confuses authors | Medium | Low | Keep `markdown` block type as transparent fallback |

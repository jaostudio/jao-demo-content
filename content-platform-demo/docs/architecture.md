# Content Platform Architecture

## ISR Flow

The demo uses Next.js Incremental Static Regeneration (ISR) for published article pages.

```
Request for /articles/[slug]
         │
         ▼
┌─────────────────────────┐
│  Check static cache     │
│  (Vercel Edge / Node)   │
└─────────┬───────────────┘
          │
    ┌─────┴─────┐
    │           │
  HIT          MISS
    │           │
    ▼           ▼
 Serve     ┌────────────────────────┐
 cached    │  Run page component    │
 HTML      │  (server-render)       │
           └───────────┬────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Store in cache      │
            │  (revalidate: 60s)   │
            └──────────────────────┘
                       │
                       ▼
                  Serve HTML
```

### Revalidation Flow

Two mechanisms:

1. **Time-based** (`revalidate: 60` in page exports):  
   Stale content is served immediately while the cache refreshes in the background.

2. **On-demand** (via `revalidatePath` / `revalidateTag`):  
   When an admin publishes or updates an article:
   - `revalidatePath('/')` — home page (article list)
   - `revalidatePath('/articles/[slug]')` — article detail
   - `revalidatePath('/admin')` — admin dashboard

## Content Publishing Lifecycle

```
               submit          approve
DRAFT ──────────────────► PENDING_REVIEW ──────────► PUBLISHED
  ▲                                                    │
  │                       reject                       │ archive
  └─────────────────────────◄──────────────────────────┤
                                                       ▼
                                                     ARCHIVED
```

- **DRAFT**: Only the author can edit. No public visibility.
- **PENDING_REVIEW**: Author submits; admin reviews.
- **PUBLISHED**: Visible on public pages after admin approval. `publishAt` is set on approval.
- **ARCHIVED**: Removed from public lists. Content retained for history.

### Permissions

| Event      | Author | Admin |
|------------|--------|-------|
| submit     | Yes    | No    |
| approve    | No     | Yes   |
| reject     | No     | Yes   |
| archive    | No     | Yes   |

Enforced by `contentMachine` from `@jaostudio/core/state-machines/content` with `ActorContext` guards.

## Cache Invalidation Strategy

| Trigger                  | Invalidation          |
|--------------------------|-----------------------|
| Article created          | `/`, `/admin`         |
| Article updated          | `/`, `/articles/[slug]`, `/admin` |
| Article status change    | `/`, `/articles/[slug]`, `/admin` |
| Category page published  | `/category/[slug]`    |

No manual cache purging — `revalidatePath` handles ISR cache invalidation at the framework level.

## SEO Pipeline

Every published article includes:

- **Server-side metadata**: `generateMetadata` returns `title`, `description`, `openGraph`, `canonical` (if set).
- **JSON-LD**: Structured data rendered via `<script type="application/ld+json">` with `@type: Article`.
- **Canonical URL**: Set per-article in admin; rendered as `<link rel="canonical">`.
- **OG tags**: `og:title`, `og:description`, `og:type`, `og:article:published_time`, `og:article:author`.

## Data Model

```
Author ──┐
          │ 1   N
          ├──── Article ── N ── ArticleTag ── N ── Tag
          │
          └──── Category (1:N)
```

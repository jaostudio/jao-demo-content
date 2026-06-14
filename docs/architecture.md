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

2. **On-demand** (via `revalidatePath`):  
   Centralised `revalidateArticlePaths()` helper in `src/lib/revalidation.ts` handles all path invalidation:
   - `revalidatePath('/')` — home page (article list)
   - `revalidatePath('/articles/[slug]')` — article detail
   - `revalidatePath('/category/[slug]')` — category page
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
- **PENDING_REVIEW**: Author submits; admin reviews. Author cannot edit while under review.
- **PUBLISHED**: Visible on public pages after admin approval. `publishAt` is set on approval.
- **ARCHIVED**: Removed from public lists. Content retained for history.

### Permissions

| Event      | Author | Admin |
|------------|--------|-------|
| submit     | Yes    | No    |
| approve    | No     | Yes   |
| reject     | No     | Yes   |
| archive    | Yes (own published) | Yes |
| delete     | No     | Yes   |

Enforced by `contentMachine` from `@jaostudio/core/state-machines/content` with `ActorContext` guards.

## Cache Invalidation Strategy

| Trigger                  | Invalidation          |
|--------------------------|-----------------------|
| Article created          | `/`, `/admin`         |
| Article updated          | `/`, `/articles/[slug]`, `/admin` |
| Article status change    | `/`, `/articles/[slug]`, `/category/[slug]`, `/admin` |
| Category page published  | `/category/[slug]`    |

No manual cache purging — `revalidatePath` handles ISR cache invalidation at the framework level.

## SEO Pipeline

Every published article includes:

- **Server-side metadata**: `generateMetadata` returns `title`, `description`, `openGraph`, `canonical` (if set).
- **JSON-LD**: Structured data rendered via `<script type="application/ld+json">` with `@type: Article`.
- **Canonical URL**: Set per-article in admin; rendered as `<link rel="canonical">`.
- **OG tags**: `og:title`, `og:description`, `og:type`, `og:article:published_time`, `og:article:author`.

## Bilingual Support

- **Locale files**: `src/i18n/messages/en.json` (English) and `tl.json` (Taglish, code-switched)
- **Provider**: `LocaleProvider` wraps the app with `NextIntlClientProvider` from next-intl
- **Persistence**: Locale stored in localStorage under `likha-locale`
- **Components**: `useTranslations()` hook for client components; `LocaleSwitcher` in header and drawer

## Dark Mode

- **Library**: next-themes with `attribute="class"` strategy
- **Defaults**: System preference, with manual toggle via `ThemeToggle` component
- **Styling**: Tailwind `dark:` variants throughout; stored in localStorage

## Version History

- `ArticleVersion` model stores previous content on every update
- Created via `prisma.$transaction` alongside the article update
- Timeline view at `/admin/articles/[id]/versions`

## Comments

- Simple `Comment` model: articleId, authorName, authorEmail, body, createdAt
- `POST /api/articles/[id]/comments` — create comment
- `GET /api/articles/[id]/comments` — fetch comments
- Displayed on article detail page via `CommentSection` client component

## Rate Limiting

- In-memory rate limiter at `src/lib/rate-limit.ts`
- Applied to `/api/register`: 5 requests per minute per IP
- Returns `429 Too Many Requests` with `Retry-After` header when exceeded

## Data Model

```
Author ──┐
          │ 1   N
          ├──── Article ── N ── ArticleTag ── N ── Tag
          │                    │
          └──── Category (1:N) │
                               │
                    Comment ───┘ (N:1)
                    
                    ArticleVersion (N:1)
```

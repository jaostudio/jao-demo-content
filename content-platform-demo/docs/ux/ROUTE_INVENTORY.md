# Route Inventory — Likha

## Route Table

| Route | Purpose | Primary CTA | User State | Data Required | Risk |
|---|---|---|---|---|---|
| `/` | Landing / featured content | Explore works | Public | Dynamic (articles, categories) | Empty state when no content |
| `/explore` | Browse all works | Filter/search | Public | Dynamic (articles, categories, tags) | Slow query with many articles |
| `/work/[slug]` | Work detail page | Read / comment | Public | Dynamic (article, versions, comments) | Missing slug 404 |
| `/search` | Search works | Search input | Public | Dynamic (query results) | No results state |
| `/trending` | Trending works | Explore | Public | Dynamic (trending articles) | Empty state |
| `/signin` | Sign in to account | Sign in form | Public | None | Auth token bug |
| `/register` | Create account | Register form | Public | None | Validation errors |
| `/studio` | Artist dashboard | Create new work | Authenticated (AUTHOR) | Dynamic (author's articles) | No works state |
| `/studio/new` | Create new work | Submit article | Authenticated (AUTHOR) | Static form | Coming soon markers |
| `/studio/work/[id]/edit` | Edit existing work | Save changes | Authenticated (AUTHOR) | Dynamic (article data) | Version conflict |
| `/studio/work/[id]/versions` | Version history | Compare versions | Authenticated (AUTHOR) | Dynamic (versions) | Empty versions |
| `/admin` | Admin dashboard | Review/analytics | Authenticated (ADMIN) | Dynamic (stats, review queue) | Error state |
| `/admin/review` | Review flagged content | Approve/reject | Authenticated (ADMIN) | Dynamic (pending review) | Empty queue |
| `/admin/analytics` | Platform analytics | View stats | Authenticated (ADMIN) | Dynamic (aggregated stats) | No data state |

## Per-Route Details

### Route: `/`

```
Page Goal:           Showcase featured works and recent content
Primary User Action: Click a work card to explore
Secondary Action:    Sign in or register

Empty State:         "No featured works yet" with CTA to explore
Loading State:       Skeleton cards (grid shimmer)
Error State:         "Unable to load content" with retry button

Mobile Behavior:     Single column layout, hamburger nav
SEO Requirement:     Title: "Likha — Process-First Creative Platform"
Analytics Event:     page_view_home
Screenshot Required: Yes
```

### Route: `/explore`

```
Page Goal:           Browse all works with filters
Primary User Action: Filter by category or search
Secondary Action:    Sort by trending/latest

Empty State:         "No works found" with clear filters CTA
Loading State:       Skeleton grid
Error State:         "Unable to load works" with retry

Mobile Behavior:     Filters collapse into drawer, card grid goes single column
SEO Requirement:     Title: "Explore Works — Likha"
Analytics Event:     page_view_explore
Screenshot Required: Yes
```

### Route: `/work/[slug]`

```
Page Goal:           Display work detail with version history
Primary User Action: Read content and view process documentation
Secondary Action:    Comment, follow author, view versions

Empty State:         N/A (404 if slug not found)
Loading State:       Article skeleton
Error State:         "Work not found" with back to explore link

Mobile Behavior:     Version comparison stacked, comments full-width
SEO Requirement:     Dynamic title from article title
Analytics Event:     page_view_work
Screenshot Required: Yes
```

### Route: `/search`

```
Page Goal:           Search all works
Primary User Action: Type search query, filter results
Secondary Action:    Switch between works/authors tabs

Empty State:         "No results for [query]" with suggestion
Loading State:       Result list skeleton
Error State:         "Search unavailable" with retry

Mobile Behavior:     Search input full-width, tabs compact
SEO Requirement:     Title: "Search — Likha"
Analytics Event:     search_query
Screenshot Required: Yes
```

### Route: `/studio`

```
Page Goal:           Artist dashboard showing their works
Primary User Action: Create new work or edit existing
Secondary Action:    Manage versions, view stats

Empty State:         "Welcome! Create your first work" with CTA to /studio/new
Loading State:       Dashboard skeleton
Error State:         "Unable to load your works" with retry

Mobile Behavior:     Sidebar collapses, cards stack
SEO Requirement:     Noindex (authenticated)
Analytics Event:     page_view_studio
Screenshot Required: Yes
```

### Route: `/admin`

```
Page Goal:           Platform admin dashboard
Primary User Action: Monitor platform health
Secondary Action:    Navigate to review or analytics

Empty State:         Stats show zeros
Loading State:       Dashboard metric skeletons
Error State:         Per-metric degradation with warning banner

Mobile Behavior:     Metrics stack vertically
SEO Requirement:     Noindex (admin only)
Analytics Event:     page_view_admin
Screenshot Required: Yes
```

## Route Groups

### Public Routes

| Route | Auth Required | Indexable |
|---|---|---|
| `/` | No | Yes |
| `/explore` | No | Yes |
| `/work/[slug]` | No | Yes |
| `/search` | No | Yes |
| `/trending` | No | Yes |
| `/signin` | No | No |
| `/register` | No | No |
| `/privacy` | No | Yes |
| `/terms` | No | Yes |
| `/security-policy` | No | Yes |

### Authenticated Routes

| Route | Role Required | Indexable |
|---|---|---|
| `/studio` | AUTHOR | No |
| `/studio/new` | AUTHOR | No |
| `/studio/work/[id]/edit` | AUTHOR (owner) | No |
| `/studio/work/[id]/versions` | AUTHOR (owner) | No |
| `/admin` | ADMIN | No |
| `/admin/review` | ADMIN | No |
| `/admin/analytics` | ADMIN | No |

### API Routes

| Route | Method | Auth | Rate Limited | Purpose |
|---|---|---|---|---|
| `/api/auth/login` | POST | No | Yes | User login |
| `/api/auth/register` | POST | No | Yes | User registration |
| `/api/auth/me` | GET | Bearer token | No | Current user info |
| `/api/articles` | GET | No | No | List articles |
| `/api/articles/[id]` | GET | No | No | Article detail |
| `/api/articles/[id]/versions` | GET | No | No | Version history |
| `/api/admin/stats` | GET | Admin | No | Dashboard stats |
| `/api/admin/review` | GET | Admin | No | Review queue |
| `/api/admin/analytics` | GET | Admin | No | Analytics data |

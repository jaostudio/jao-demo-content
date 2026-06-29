# Route Inventory

## Route Table

| Route | Purpose | Primary CTA | User State | Data Required | Risk |
|---|---|---|---|---|---|
| `/` | [Purpose] | [Primary CTA] | [Public/Auth] | [Static/Dynamic] | [Top risk] |
| `/portfolio` | [Purpose] | [Primary CTA] | [Public/Auth] | [Project data] | [Top risk] |
| `/pricing` | [Purpose] | [Primary CTA] | [Public/Auth] | [Pricing config] | [Top risk] |
| `/admin` | [Purpose] | [Primary CTA] | [Authenticated] | [DB data] | [Top risk] |

## Per-Route Details

### Route: `[route]`

```
Page Goal:           [What this page achieves]
Primary User Action: [What the user should do first]
Secondary Action:    [Supporting actions]

Empty State:         [What user sees with no data]
Loading State:       [Skeleton / spinner / progress]
Error State:         [Error message and recovery]

Mobile Behavior:     [Layout changes, interaction changes]
SEO Requirement:     [Title, description, open graph]
Analytics Event:     [Event name on key action]
Screenshot Required: [Yes/No]
```

---

### Route: `[route]`

```
Page Goal:           [What this page achieves]
Primary User Action: [What the user should do first]
Secondary Action:    [Supporting actions]

Empty State:         [What user sees with no data]
Loading State:       [Skeleton / spinner / progress]
Error State:         [Error message and recovery]

Mobile Behavior:     [Layout changes, interaction changes]
SEO Requirement:     [Title, description, open graph]
Analytics Event:     [Event name on key action]
Screenshot Required: [Yes/No]
```

---

## Route Groups

### Public Routes

| Route | Auth Required | Indexable |
|---|---|---|
| `/` | No | Yes |
| `/portfolio` | No | Yes |
| `/pricing` | No | Yes |
| `/contact` | No | Yes |

### Authenticated Routes

| Route | Role Required | Indexable |
|---|---|---|
| `/dashboard` | user | No |
| `/admin` | admin | No |
| `/settings` | user | No |

### API Routes

| Route | Method | Auth | Rate Limited |
|---|---|---|---|
| `/api/contact` | POST | No | Yes |
| `/api/quote` | POST | No | Yes |
| `/api/projects` | GET | Yes | No |

# Empty, Loading, Error States Template

## State Standards

Every route and component that handles dynamic data must define:

| State | Trigger | UI Treatment | Next Action |
|---|---|---|---|
| Empty | No data exists | EmptyState component | Create / browse / import |
| Loading | Data in transit | Skeleton / spinner | Wait (no action needed) |
| Error | Request failed | ErrorState component | Retry / go back / contact |
| Success | Data loaded | Normal render | Interact with data |

---

## Empty States

### Route: `[route]`

```
Empty State:
  Title: [Short description]
  Description: [What this space is for and what to do]
  Action: [Button/link to next step]
  Icon/Illustration: [Optional]
```

### Examples

```
Route: /dashboard
  Title: "No projects yet"
  Description: "Create your first project to start tracking quotes."
  Action: "Create Project"

Route: /inbox
  Title: "No messages"
  Description: "When clients respond to your proposals, their messages will appear here."
  Action: "View Proposals" (link back to proposals)

Route: /search?q=xyz
  Title: "No results for 'xyz'"
  Description: "Try a different search term or browse our categories."
  Action: "Clear Filters"
```

---

## Loading States

### Route: `[route]`

```
Loading State:
  Type: [Skeleton / Spinner / Progress Bar]
  Description: [What renders while loading]
  Duration hint: [Expected load time]
```

### Rules

```
- Skeleton should match the layout of the content it replaces.
- Spinner for button/submit actions.
- Progress bar for determinate multi-step processes.
- Timeout message if loading exceeds 10 seconds.
```

---

## Error States

### Route: `[route]`

```
Error State:
  Title: [What went wrong]
  Description: [User-friendly explanation]
  Recovery: [Retry button / Back button / Contact link]
  Hide details: [Do not expose stack traces]
```

### Examples

```
Route: /api/quote
  Title: "Could not save your quote"
  Description: "Your session may have expired. Please refresh the page and try again."
  Recovery: "Refresh Page"

Route: /api/projects
  Title: "Unable to load projects"
  Description: "There was a network error. Check your connection and try again."
  Recovery: "Retry" + "Go to Dashboard"

Route: /admin/users
  Title: "Permission denied"
  Description: "You do not have access to this section. Contact an administrator if you need access."
  Recovery: "Go to Dashboard"
```

---

## State Checklist

For each route, verify:

- [ ] Empty state exists and provides a next action
- [ ] Loading state appears immediately (no blank screen)
- [ ] Loading state matches content layout (skeleton preferred)
- [ ] Error state explains what happened in user language
- [ ] Error state offers a recovery action
- [ ] Timeout handling for long requests
- [ ] Offline detection where relevant
- [ ] All states work at mobile viewport

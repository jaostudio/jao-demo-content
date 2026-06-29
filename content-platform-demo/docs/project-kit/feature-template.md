# SaaS Feature Template

## Feature: `[Feature Name]`

### Entry Points

```
1. [How user accesses this feature]
2. [Alternative access]
```

### Route

```
[Route pattern — e.g., /dashboard/[feature]]
```

### Permissions

```
| Role | Access Level |
|---|---|
| admin | Full CRUD |
| user | Read own, create, update own |
| viewer | Read own |
```

### Components

```
- [Component name] — [Purpose]
- [Component name] — [Purpose]
```

### Data Model

```
Entity: [table_name]
Fields:
  - [field]: [type]
  - [field]: [type]
Relations:
  - [relation]
```

### States

```
| State | UI |
|---|---|
| Loading | [Skeleton/spinner description] |
| Empty | [Empty state title + description + action] |
| Error | [Error state title + description + recovery] |
| Success | [Normal render] |
```

### API

```
| Method | Route | Purpose |
|---|---|---|
| GET | /api/[resource] | List |
| GET | /api/[resource]/[id] | Detail |
| POST | /api/[resource] | Create |
| PUT | /api/[resource]/[id] | Update |
| DELETE | /api/[resource]/[id] | Delete |
```

### Validation

```
- [Field]: [rule]
- [Field]: [rule]
```

### Analytics Events

```
- [event_name]: [when fired]
- [event_name]: [when fired]
```

### Edge Cases

```
- [Edge case and handling]
- [Edge case and handling]
```

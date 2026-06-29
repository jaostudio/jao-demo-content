# State Machine Template

## Flow: [Flow Name]

### States

```
[State] → [Event] → [State]
```

### Diagram

```
[Initial state]
    ↓ [Trigger]
[State 1]
    ↓ [Action]
[State 2]
    ↓ [Action]
[State 3]
    ↓ [Submit]
[Success state]
    ↓
[Error state] ← [Failure]
    ↓ [Retry]
[State 2]
```

### State Definitions

| State | Description | UI State | Allowed Actions |
|---|---|---|---|
| `initial` | User has not started | Default view | Start flow |
| `state_1` | [Description] | Form step 1 | Fill fields, go back |
| `state_2` | [Description] | Form step 2 | Fill fields, go back |
| `loading` | Processing | Spinner/skeleton | Cancel |
| `success` | Flow completed | Confirmation screen | View result, start over |
| `error` | Something failed | Error message | Retry, contact support |
| `empty` | No data available | Empty state | Create first item |

### Transition Rules

```
From             | Event             | To               | Condition
-----------------|-------------------|------------------|------------------
[from state]     | [event]           | [to state]       | [condition]
[from state]     | [event]           | [to state]       | [condition]
[from state]     | [event]           | [to state]       | [condition]
```

---

## Example: Quote Builder

```
Viewed
    ↓ [Select option]
Option selected
    ↓ [Enter requirements]
Requirements entered
    ↓ [Review]
Review
    ↓ [Submit started]
Submitting
    ├──→ [Submit success]
    │       ↓ [Admin reviews]
    │   Admin review
    │       ↓ [Proposal generated]
    │   Proposal generated
    │       ↓ [Sent to client]
    │   Proposal sent
    └──→ [Submit error]
            ↓ [Retry]
        Requirements entered
```

## Example: Auth Flow

```
Unauthenticated
    ↓ [Navigate to protected page]
    ↓ [Login]
Login
    ↓ [Credentials valid]
Role resolved
    ↓ [Authorized]
Shell loaded
    ↓ [Navigate to page]
Page-level permission check
    ├──→ Allowed (render page)
    └──→ Blocked (403 / redirect)
```

## Example: Portfolio Review

```
Homepage
    ↓ [Click portfolio]
Portfolio list
    ↓ [Select case study]
Featured case study
    ├──→ [Click live demo]
    │   Live demo
    ├──→ [View technical proof]
    │   Technical deep-dive
    └──→ [Contact]
    Contact form
```

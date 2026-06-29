# Authorization Model

## Auth Flow

```
1. User navigates to route
2. Middleware checks session
3. If unauthenticated and route requires auth → redirect to login
4. If authenticated → resolve role
5. Load shell layout
6. Check page-level permissions
7. Render page or 403
```

## Session Strategy

| Concern | Decision |
|---|---|
| Session storage | [JWT / Database session] |
| Session expiry | [Duration] |
| Refresh mechanism | [Silent refresh / Re-login] |
| Cookie config | [HttpOnly, Secure, SameSite] |

## Roles

| Role | Description | Inherits From |
|---|---|---|
| `admin` | Full system access | — |
| `user` | Standard authenticated user | — |
| `viewer` | Read-only access | — |

### Permissions by Role

| Action | admin | user | viewer | Public |
|---|---|---|---|---|
| View public pages | ✓ | ✓ | ✓ | ✓ |
| View own dashboard | ✓ | ✓ | ✓ | ✗ |
| Create quote | ✓ | ✓ | ✗ | ✗ |
| View all quotes | ✓ | ✗ | ✗ | ✗ |
| Manage users | ✓ | ✗ | ✗ | ✗ |
| View admin panel | ✓ | ✗ | ✗ | ✗ |

## Route Protection

| Route Pattern | Guard | Redirect |
|---|---|---|
| `/dashboard/*` | `authenticated` | `/login` |
| `/admin/*` | `role:admin` | `/dashboard` or 403 |
| `/login` | `redirect-if-authenticated` | `/dashboard` |
| `/api/admin/*` | `role:admin` | 403 |

## Page-Level Authorization

```
- Pages check permissions after shell loads.
- API routes check permissions before processing.
- Data access is scoped to the authenticated user.
- Admin routes must verify admin role on every request.
```

## Row-Level Security

If applicable:

```
- Users can only access their own data unless they have admin role.
- Admin can view all data but scoped to the organization.
- Deletion is soft (archived flag) for audit purposes.
```

## Auth Provider

```
Provider: [NextAuth / Clerk / Auth0 / Custom]
Config:
  - [Provider-specific config]
  - [OAuth providers if any]
  - [Magic link / password / SSO]
```

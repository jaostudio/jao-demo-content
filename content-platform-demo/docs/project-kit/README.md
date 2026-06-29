# SaaS App Kit

## When To Use

- Subscription-based applications
- Client portals
- SaaS dashboards
- Tools with user accounts

## Required Docs

- `docs/project/PROJECT_BRIEF.md`
- `docs/product/PRODUCT_REASONING.md`
- `docs/design/DESIGN_CONTRACT.md`
- `docs/ux/ROUTE_INVENTORY.md`
- `docs/ux/FLOWS.md`
- `docs/architecture/ARCHITECTURE.md`
- `docs/architecture/DATA_MODEL.md`
- `docs/architecture/AUTHORIZATION_MODEL.md`
- `docs/architecture/SECURITY_MODEL.md`

## Required Routes

```
/              — Marketing homepage
/login         — Authentication
/register      — User registration
/dashboard     — Main app view
/settings      — User settings
/admin         — Admin panel (if applicable)
/api/*         — API routes
```

## Common Risks

| Risk | Mitigation |
|---|---|
| Auth security gaps | Authorization model documented, rate limited, session hardened |
| Permission bugs | Test all role-based access scenarios |
| Data loss | Backups configured, destructive actions require confirmation |
| Poor empty states | Every dashboard view has designed empty state |
| Slow authenticated routes | Database indexed, queries optimized |
| Onboarding friction | User flow tested end-to-end with new account |

## QA Gate

See `qa-gate.md` in this kit for SaaS-specific QA requirements.

## Launch Criteria

```
- [ ] Auth flow tested (register, login, logout, session expiry)
- [ ] Role-based permissions tested
- [ ] All empty states designed
- [ ] All loading states designed
- [ ] All error states designed with recovery
- [ ] Rate limiting active on all public and auth routes
- [ ] Database backups configured
- [ ] Smoke tests cover all authenticated routes
- [ ] Security audit passed
- [ ] Humanization audit passed
```

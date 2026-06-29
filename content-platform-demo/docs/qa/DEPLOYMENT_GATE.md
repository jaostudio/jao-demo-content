# Deployment Gate

## Purpose

Ensure the project is ready for production deployment with all quality checks passing.

## Prerequisites

- [ ] All previous QA gates passed (local, design, accessibility, performance, security)
- [ ] Production environment variables configured
- [ ] Production database provisioned and migrated
- [ ] CI pipeline passing on main branch

## Build Verification

```bash
npm run build
```

Build must succeed with zero errors.

## Production Checks

### Routes

- [ ] All public routes load correctly in production
- [ ] All authenticated routes load correctly
- [ ] 404 page renders for unknown routes
- [ ] Redirects functional
- [ ] Custom domain resolves (if applicable)
- [ ] SSL certificate valid

### Data

- [ ] Database connection verified
- [ ] Migrations applied
- [ ] Seed data present (if needed)
- [ ] Read/write operations work

### Auth

- [ ] Login flow works
- [ ] Registration flow works
- [ ] Session persists correctly
- [ ] Logout clears session
- [ ] Protected routes redirect unauthenticated users

### Forms

- [ ] Contact form submits correctly
- [ ] Validation errors display
- [ ] Success state displays
- [ ] Rate limiting active (test with rapid submissions)
- [ ] Admin receives notification (if applicable)

### Monitoring

- [ ] Health check endpoint returns 200
- [ ] Error tracking active (if configured)
- [ ] Analytics events firing (if configured)
- [ ] Logs streaming correctly

## Smoke Tests

```bash
npm run test:smoke
# or
npm run test:e2e -- --grep "@smoke"
```

All smoke tests must pass.

## Rollback Plan

```
1. Rollback command: vercel rollback [deployment-id]
2. Database rollback: npm run db:rollback
3. Verification: smoke tests against rolled-back version
4. If rollback needed, create a task packet to fix the root cause before redeploying
```

## Pass Criteria

```
- Production build succeeds
- All routes load without errors
- Auth flow works end-to-end
- Forms submit correctly
- Rate limiting active
- Health check passes
- Smoke tests pass
- Rollback plan documented
```

## Fail Actions

| Issue | Action |
|---|---|
| Build fails | Fix build before deploying |
| Route 500 error | Check logs, fix error, redeploy |
| Auth broken | Rollback if production, fix in preview |
| Form submission fails | Check API route, database connection |
| Rate limiting not working | Configure rate limiter, redeploy |
| Health check fails | Investigate infrastructure issue |

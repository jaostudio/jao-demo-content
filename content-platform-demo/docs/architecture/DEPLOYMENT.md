# Deployment

## Platform

```
Provider: Vercel
Plan: [Hobby / Pro / Enterprise]
Region: [us-east / eu-west / auto]
```

## CI/CD Pipeline

```
Pull Request
  → Typecheck
  → Lint
  → Unit tests
  → Build
  → Route smoke tests
  → Accessibility tests
  → Visual screenshots
  → Deploy preview
  → Manual browser review
  → Merge to main

Merge to main
  → Typecheck
  → Lint
  → Test
  → Build
  → Deploy production
  → Production smoke test
```

## Environment Configuration

| Environment | Branch | Domain | Database |
|---|---|---|---|
| Preview | feature/* | *.vercel.app | Preview DB |
| Staging | main | staging.example.com | Staging DB |
| Production | release/* | example.com | Production DB |

## Environment Variables

| Variable | Preview | Staging | Production |
|---|---|---|---|
| `DATABASE_URL` | Preview DB | Staging DB | Production DB |
| `AUTH_SECRET` | Random per deploy | Staging secret | Production secret |
| `NEXT_PUBLIC_URL` | Preview URL | Staging URL | Production URL |

## Build Commands

```bash
npm run build          # Production build
npm run test           # Unit + integration tests
npm run test:e2e       # E2E tests
npm run test:routes    # Route smoke tests
npm run test:visual    # Visual regression tests
npm run test:a11y      # Accessibility tests
npm run lint           # Lint check
npm run typecheck      # TypeScript check
```

## Rollback Procedure

```
1. Identify the last known good deployment.
2. Use Vercel dashboard or CLI to redeploy that version.
3. Verify rollback with smoke tests.
4. If database migration was involved, roll back the migration.
5. Investigate the failed deployment. Do not redeploy until root cause is found.
```

## Health Monitoring

```
- Health check endpoint: /api/health
- Expected response: { status: "ok", timestamp, version }
- Monitored metrics: response time, error rate, uptime
- Alert channel: [Email / Slack / PagerDuty]
```

## Post-Deployment Checklist

```
- [ ] Production build passes
- [ ] Smoke tests pass against production
- [ ] Health check endpoint returns 200
- [ ] All routes load without errors
- [ ] SSL certificate valid
- [ ] Custom domain resolves (if applicable)
- [ ] CDN cache warmed
- [ ] Analytics events firing
- [ ] Database connection verified
- [ ] Auth flow works (login, register, session)
- [ ] Public forms submit correctly
- [ ] Rate limiting active on public endpoints

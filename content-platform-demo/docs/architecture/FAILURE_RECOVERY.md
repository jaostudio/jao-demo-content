# Failure Recovery

## Database Failures

| Scenario | Detection | Response | Recovery |
|---|---|---|---|
| Connection loss | Health check fails | Show 500 page, log error | Auto-reconnect, notify if persistent |
| Migration failure | Migration script error | Block deploy, revert migration | Fix migration, test in preview, reapply |
| Data corruption | Application errors | Restore from backup | Identify scope, restore affected records |
| Query timeout | Slow query log | Optimize query, add index | Add index, reduce query complexity |

## Auth Failures

| Scenario | Detection | Response | Recovery |
|---|---|---|---|
| Auth provider down | Login fails | Show error with retry option | Failover to secondary provider if available |
| Session corruption | Invalid token | Redirect to login | Clear session cookie, re-authenticate |
| Rate limit hit | 429 response | Show retry-after message | Wait, do not bypass rate limiter |

## Deployment Failures

| Scenario | Detection | Response | Recovery |
|---|---|---|---|
| Build fails | CI pipeline | Block deploy, notify team | Fix build, retry |
| Deploy succeeds but site errors | Smoke tests fail | Rollback to last good version | Investigate root cause, fix, redeploy |
| Database migration conflicts | Migration script fails | Block deploy, revert | Resolve migration order, reapply |
| Environment variable missing | Runtime error | Show 500 page, log error | Add variable, restart deployment |

## Network Failures

| Scenario | Detection | Response | Recovery |
|---|---|---|---|
| Third-party API down | API call fails | Graceful degradation, log error | Retry with backoff, notify if persistent |
| CDN failure | Asset load fails | Fallback to direct serve | Wait for CDN recovery or switch provider |
| DNS resolution | DNS lookup fails | Health check alert | Update DNS records, wait for propagation |

## Data Backup

| Asset | Frequency | Retention | Location |
|---|---|---|---|
| Database | Daily | 30 days | Automated backup service |
| File storage | Continuous | 90 days | Cloud storage |
| Environment config | Per deploy | Git history | Repository |

## Backup Restoration

```
1. Identify the backup timestamp before corruption/failure.
2. Restore database from backup.
3. Verify data integrity with automated checks.
4. Notify affected users if data loss occurred.
5. Investigate root cause of corruption.
```

## Rollback Procedure

```
1. Identify the last known good deployment version.
2. Revert code to that version (git revert or rollback button).
3. Note: If database migration is irreversible, rollback requires data migration too.
4. Deploy the reverted code.
5. Run smoke tests to confirm recovery.
6. Notify team that rollback is complete.
7. Do not redeploy the failed version until root cause is found and fixed.
```

## Incident Response

```
P0 — Site down or data loss
  Response: Immediate, all hands
  SLA: < 1 hour to mitigate

P1 — Major feature broken
  Response: Within 1 hour
  SLA: < 4 hours to fix or rollback

P2 — Minor feature broken
  Response: Within 24 hours
  SLA: Next deploy cycle

P3 — Cosmetic issue
  Response: Next sprint
  SLA: No fixed timeline
```

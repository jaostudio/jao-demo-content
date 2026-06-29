# Observability

## Logging

| Concern | Strategy |
|---|---|
| Framework | [pino / winston / console with structured format] |
| Format | JSON with timestamp, level, message, requestId, service name |
| Levels | error, warn, info, debug |
| Request correlation | requestId in every log entry via middleware |
| Sensitive data | Never log tokens, passwords, or PII |

### What To Log

```
- Incoming requests (method, path, status, duration, requestId)
- Auth events (login success, login failure, token refresh)
- API errors (error type, message, stack trace in development only)
- Rate limit triggers (IP, route, timestamp)
- Background job lifecycle (start, complete, fail)
- Database query errors (not queries themselves)
```

### What Not To Log

```
- Raw request bodies containing passwords or tokens
- Database connection strings
- Full stack traces in production API responses
- User personal data unless explicitly required for debugging
```

## Error Tracking

```
Tool: [Sentry / Highlight / None for MVP]
Configuration:
  - Error filtering by environment
  - Performance monitoring (optional)
  - User feedback capture (optional)
```

## Metrics

| Metric | Source | Alert Threshold |
|---|---|---|
| Response time p95 | Application logs | > 500ms |
| Error rate | Application logs | > 1% of requests |
| Uptime | Health check | < 99.9% |
| Auth failure rate | Auth logs | > 10% of login attempts |
| Rate limit triggers | Application logs | Anomaly detection |

## Health Checks

| Endpoint | Purpose | Expected Response |
|---|---|---|
| `/api/health` | Basic health | `{ status: "ok" }` |
| `/api/health/db` | Database connectivity | `{ status: "ok", db: "connected" }` |
| `/api/health/ready` | Readiness check | `{ status: "ok", version }` |

## Alerting

```
- Error rate > 1% over 5 minutes → notify
- Response time p95 > 1000ms → notify
- Health check fails 3 consecutive times → notify
- Auth failure rate spike > 5x baseline → investigate
```

## Dashboard

```
If applicable, create a monitoring dashboard with:
- Request volume over time
- Error rate by route
- Response time percentiles (p50, p95, p99)
- Active users
- Deployment frequency
```

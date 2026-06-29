# MVP vs Scale

## MVP

### Infrastructure

```
Single repo
Simple database (SQLite / Turso)
Minimal auth (email + password or OSS social)
Static config where possible
Manual admin if acceptable
Basic analytics
Vercel / simple deployment
```

### Quality Requirements

```
Design contract exists
Route inventory exists
Component rules defined
Build passing
Mobile QA complete
Error states covered
Deployment stable
Screenshot QA per route
```

### What To Leave Out

```
Multi-tenant isolation
Background job queues
Audit logs
Advanced caching
SSO / SAML
Role-based permissions
Full test coverage
```

## Scale

### Infrastructure

```
Modular feature boundaries
PostgreSQL
Prisma or Drizzle ORM
Redis where justified
Queue workers (Bull / RabbitMQ)
Structured logging
Rate limiting
CI/CD gates with preview environments
Backup / restore plan
```

### Additional Quality Requirements

```
Visual regression tests
Storybook or component docs
Observability (metrics, traces, alerts)
Security review
Penetration testing
Compliance documentation
```

### When To Add (Not Before)

```
Do not add scale infrastructure to demos.
Do not add Redis until caching is proven necessary.
Do not add multi-tenant until tenant isolation is a real requirement.
Do not add background workers until a job exceeds request-timeout limits.
```

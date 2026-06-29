# Security Model

## Authentication

```
- Passwords hashed with bcrypt (cost factor 12).
- Session tokens are cryptographically random.
- Session cookies: HttpOnly, Secure, SameSite=Lax.
- Login rate limiting: 5 attempts per minute per IP.
- Account lockout after 10 failed attempts.
```

## Authorization

```
- All API routes check authorization before processing.
- Server actions verify the user's role and ownership.
- Admin routes verify admin role on every request.
- Data queries scope to the authenticated user's ID.
```

## Input Validation

```
- All user input validated server-side with schema validation (Zod / Valibot).
- HTML sanitized on output (no raw HTML rendering unless explicitly approved).
- File uploads: type checking, size limits, virus scanning.
- SQL injection prevented by parameterized queries (ORM).
```

## API Security

```
- Rate limiting on all public write endpoints.
- CORS configured to allow only the production origin.
- CSRF protection via SameSite cookies and token-based validation.
- API responses do not expose stack traces or internal details.
- Request size limits for POST bodies.
```

## Data Protection

```
- Data encrypted at rest (database encryption).
- Data encrypted in transit (TLS 1.3).
- Secrets managed via environment variables, not code.
- Database credentials never logged or exposed.
- Personal data retention policy defined.
```

## Frontend Security

```
- Content Security Policy headers configured.
- XSS protection via framework defaults (React escapes by default).
- No inline scripts unless nonce is used.
- `X-Content-Type-Options: nosniff` header.
- `X-Frame-Options: DENY` header (or SAMEORIGIN if embedding needed).
```

## Dependencies

```
- Dependencies scanned with `npm audit` / Snyk / Dependabot.
- Major version updates reviewed before merge.
- Zero high-severity vulnerability policy for production.
```

## Incident Response

```
1. Identify: Monitor for unusual patterns (error rate spikes, auth failures).
2. Contain: Rate limit aggressively, disable vulnerable feature, rollback.
3. Investigate: Check logs, identify scope, determine root cause.
4. Fix: Deploy patch, rotate secrets if compromised.
5. Postmortem: Document timeline, root cause, and prevention measures.
```

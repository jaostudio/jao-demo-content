# Security Gate

## Purpose

Ensure the project meets minimum security standards for production deployment.

## Automated Checks

```bash
npm audit
# or
npx snyk test
```

## Checklist

### Authentication

- [ ] Passwords hashed with bcrypt (cost factor >= 12) or equivalent
- [ ] Session cookies: HttpOnly, Secure, SameSite=Lax or Strict
- [ ] Login rate limited: 5 attempts per minute per IP
- [ ] No hardcoded credentials anywhere in the codebase
- [ ] Session timeout implemented (inactivity logout)

### Authorization

- [ ] API routes check authorization before processing
- [ ] Server actions verify user role and ownership
- [ ] Admin routes verify admin role on every request
- [ ] Data queries scoped to authenticated user

### Input Validation

- [ ] All user input validated server-side (Zod / Valibot)
- [ ] HTML sanitized on output (no raw HTML rendering)
- [ ] No eval() or similar dangerous functions
- [ ] SQL injection prevented (parameterized queries via ORM)

### API Security

- [ ] Rate limiting on all public write endpoints
- [ ] CORS allows only production origin
- [ ] CSRF protection (SameSite cookies + token validation)
- [ ] No stack traces in API error responses
- [ ] Request size limits on POST bodies

### Frontend

- [ ] Content Security Policy headers configured
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options: DENY` (or SAMEORIGIN)
- [ ] No inline scripts without nonce
- [ ] No secrets in client-side code or environment variables prefixed with `NEXT_PUBLIC` intentionally

### Data Protection

- [ ] Data encrypted in transit (TLS 1.3)
- [ ] Secrets managed via environment variables, not code
- [ ] No sensitive data in logs
- [ ] Database credentials never exposed

### Dependencies

- [ ] `npm audit` shows 0 critical vulnerabilities
- [ ] No deprecated packages with known CVEs
- [ ] Auto-update enabled (Dependabot / Renovate)

## Pass Criteria

```
- npm audit: 0 critical, 0 high vulnerabilities
- Rate limiting active on all public POST endpoints
- Input validation on all forms
- Auth boundaries enforced
- No secrets in code
- CSP headers present
```

## Fail Actions

| Issue | Action |
|---|---|
| Hardcoded secret | Rotate secret, move to environment variable |
| Missing validation | Add server-side schema validation |
| Missing rate limiting | Add rate limiter to public endpoints |
| CORS too permissive | Restrict to production origin |
| Critical vulnerability | Update or replace the dependency |

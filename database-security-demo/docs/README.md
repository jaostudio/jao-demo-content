# Database & Security Demo

## Purpose
Secure B2B client portal demonstrating auditability, authorization, rate limiting, and data isolation.

## Archetype Coverage
Security / Identity — auth, RBAC, audit logging, data isolation, security headers.

## What's Built
- Organization-scoped data isolation (all queries filter by orgId from JWT)
- Three-tier RBAC: SYSTEM_ADMIN, ORG_ADMIN, ORG_USER
- Document CRUD with org-level access control and full audit logging
- Audit trail viewer with causationId chain display
- Security headers via middleware (CSP, HSTS, X-Frame-Options, Permissions-Policy)
- Security settings per organization
- User management for system admins

## Architecture
- Next.js 16 App Router, Prisma + SQLite, 6 models
- @jaostudio/core — rate limiter, event envelope with causationId
- NextAuth v4 CredentialsProvider with JWT role + orgId embedding
- Security middleware adding headers on all routes
- Server actions with requireSystemAdmin and requireOrgAccess guards

## Credentials
| Email | Role |
|---|---|
| admin@security.dev | SYSTEM_ADMIN |
| orgadmin@security.dev | ORG_ADMIN |
| orguser@security.dev | ORG_USER |

Password: `password123`

## Commands
```
npm run dev        # Start development server
npm run build      # Production build
npm run db:seed    # Re-seed database
```

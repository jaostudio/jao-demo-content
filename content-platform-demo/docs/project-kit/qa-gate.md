# SaaS App QA Gate

## Specific Checks

### Authentication

- [ ] Registration flow complete end-to-end
- [ ] Login with valid credentials works
- [ ] Login with invalid credentials shows error
- [ ] Session persists across page reload
- [ ] Session expires correctly
- [ ] Logout clears session and redirects
- [ ] Password reset flow works (if implemented)
- [ ] Rate limiting on login (5 attempts/minute)

### Authorization

- [ ] Unauthenticated users redirected to login for protected routes
- [ ] Users see only their own data
- [ ] Admin users can access admin routes
- [ ] Non-admin users blocked from admin routes (403)
- [ ] API routes enforce same permissions

### Dashboard

- [ ] Empty state shown when no data
- [ ] Loading state shown during data fetch
- [ ] Error state shown on fetch failure with retry
- [ ] Data loads within 2 seconds
- [ ] Mobile layout functional

### Settings

- [ ] Profile update works
- [ ] Password change works
- [ ] Account deletion (if implemented) asks for confirmation
- [ ] Changes persisted after page reload

### Admin Panel (if applicable)

- [ ] User list loads
- [ ] User detail loads
- [ ] CRUD operations work
- [ ] Audit log present (if implemented)
- [ ] Admin cannot accidentally perform destructive actions without confirmation

### Security

- [ ] Rate limiting on login
- [ ] Rate limiting on registration
- [ ] Rate limiting on password reset
- [ ] CORS configured correctly
- [ ] No sensitive data in API responses

## Standard QA Gates

Also run:

- `../07-qa-gates/LOCAL_DEV_GATE.md`
- `../07-qa-gates/DESIGN_QA_GATE.md`
- `../07-qa-gates/ACCESSIBILITY_GATE.md`
- `../07-qa-gates/PERFORMANCE_GATE.md`
- `../07-qa-gates/SECURITY_GATE.md`
- `../07-qa-gates/HUMANIZATION_GATE.md`
- `../07-qa-gates/DEPLOYMENT_GATE.md`

## Launch Checklist

- [ ] Auth flow tested end-to-end
- [ ] Permissions tested for all roles
- [ ] All states (empty, loading, error) covered
- [ ] Data persistence verified
- [ ] Rate limiting active
- [ ] Backup configured
- [ ] Monitoring active
- [ ] Rollback plan documented

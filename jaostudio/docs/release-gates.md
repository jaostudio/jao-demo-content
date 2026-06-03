# Release Gates

Every production deployment must pass all gates below before promotion.

## Gate Table

| Gate | Pass Condition | Failure Action |
|---|---|---|
| **Build** | `next build` exits 0 with no errors | Block deploy. Fix compiler errors first. |
| **Smoke Test** | `npm run qa:smoke` — 0 failures (warnings allowed) | Block deploy. Investigate each failure. |
| **Lighthouse** | All routes ≥ 70 performance, ≥ 90 accessibility/SEO | Warn at <80 perf. Block at <70. |
| **Console** | No unexpected errors in smoke test output | Investigate each error. Rate-limit 422s/429s are expected. |
| **CSP** | No critical CSP violations | Investigate blocked resources. Non-critical violations (fonts, analytics) are expected. |
| **Contact API** | POST `/api/contact` with valid payload → 200; burst → 429 | Block deploy if API returns 5xx or incorrect schema validation. |
| **Runtime Health** | `[health] Overall: HEALTHY or DEGRADED` — not UNHEALTHY | Check `vercel logs` for missing env vars. Add missing vars or accept degraded mode. |
| **Bundle Budget** | Shared JS <190 kB (warn), <210 kB (fail) | Investigate bundle increases. Update budget if justified. |
| **Security Headers** | CSP, HSTS, X-Content-Type-Options present on all routes | Verify via curl: `curl -I https://<deploy>/ \| grep -i 'content-security-policy'` |

## Smoke Test Runbook

```sh
# Against production
npm run qa:smoke -- --url https://portfolio-v1-pi-coral.vercel.app

# Against preview deployment
npm run qa:smoke -- --url https://<preview-url>.vercel.app
```

Artifacts written to `logs/smoke-{timestamp}.json` and `logs/smoke-{timestamp}.png`.

## Contact / Email Verification

Use the exact payload encoding expected by the contact schema when doing a manual email check. The budget and timeline values must keep the Unicode en dashes intact, for example `$1,000 – $3,000` and `2–4 weeks`.

If the endpoint returns `429 Too Many Requests`, that usually means the sliding-window limiter is still warm from smoke testing or a recent manual submission. Wait for the limiter window to reset, or retry from a fresh client/IP, before treating the email test as a schema or encoding failure.

## Lighthouse Runbook

```sh
npm run qa:lighthouse -- --url https://portfolio-v1-pi-coral.vercel.app
```

Reports written to `reports/lighthouse/{YYYY-MM-DD}/`. Each run creates a new date-stamped directory for regression tracking.

## Rollback Procedure

1. Identify the last known good deployment:
   ```sh
   npx vercel list --prod
   ```
2. Redeploy the previous deployment hash:
   ```sh
   npx vercel --prod <deployment-url>
   ```
3. Verify rollback:
   ```sh
   npm run qa:smoke -- --url https://portfolio-v1-pi-coral.vercel.app
   ```

## Env Var Safety

- Env vars are scoped per-environment (production/preview/development) in Vercel dashboard
- Missing vars produce `[health]` warnings at boot but don't crash the app
- `npx vercel logs` can be empty on low-traffic deployments; if that happens, visit a few pages or use `--follow` and reload the site so the cold-boot `[health]` report appears
- To update a var: `npx vercel env add <KEY> production` then redeploy

## Release Checklist

- [ ] `next build` passes
- [ ] Smoke test: 0 failures
- [ ] Lighthouse: no route <70
- [ ] Contact API: valid submission → 200
- [ ] Security headers: present via curl
- [ ] Bundle: under fail threshold
- [ ] Runtime health: not UNHEALTHY
- [ ] PostHog events: verified in dashboard (post-deploy)

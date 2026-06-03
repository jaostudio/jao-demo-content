# Deployment Checklist

## Pre-Deploy

- [ ] `next build` passes — 0 errors, 0 warnings
- [ ] Bundle size within budget (run `node scripts/check-budget.js`)
- [ ] No new console errors on production (PostHog 404/401 expected)
- [ ] Smoke test passes against preview URL
- [ ] Screenshots render correctly
- [ ] PostHog env vars set in Vercel:
  - `NEXT_PUBLIC_POSTHOG_KEY`
  - `NEXT_PUBLIC_POSTHOG_HOST` (optional — defaults to `https://us.i.posthog.com`)
- [ ] Lighthouse scores recorded in `reports/lighthouse/`
- [ ] Gallery images populated for any new project

## During Deploy

- Monitor Vercel deployment logs for build errors
- Verify deployment status: Ready (not Building, not Error)

## Post-Deploy

- [ ] Visit production URL — all routes load without errors
- [ ] Open Console — no unexpected errors
- [ ] Verify PostHog events firing (Network tab → filter by `i.posthog.com`)
- [ ] Run Lighthouse against production URL
- [ ] Record Lighthouse scores in `docs/performance-budget.md`
- [ ] Verify any updated project gallery images

## Rollback

If a deploy introduces a regression:

1. Identify the breaking commit
2. Revert via `git revert <sha>` or redeploy previous Vercel deployment
3. Fix the issue in a branch, re-run full QA, deploy again

## Hotfix Policy

- Hotfixes skip the full QA suite — smoke test only
- Hotfix must be followed by a full QA run within 24 hours
- Hotfix branches are named `hotfix/<description>`

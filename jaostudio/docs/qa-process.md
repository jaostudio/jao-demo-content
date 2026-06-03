# QA Process

## Triggering QA

QA can be run locally or via GitHub Actions workflow dispatch.

### Local Commands

```bash
# Smoke test — checks console errors, 404s, and network failures
npm run qa:smoke -- --url https://your-domain.com

# Lighthouse audits — performance, accessibility, best practices
npm run qa:lighthouse -- --url https://your-domain.com

# Screenshot capture — project page visuals for gallery
npm run qa:screenshots -- --url https://your-domain.com

# Run all three sequentially
npm run qa:all -- --url https://your-domain.com
```

### CI (GitHub Actions)

1. Navigate to Actions > QA Pipeline
2. Click "Run workflow"
3. Enter the target URL (preview or production)
4. Workflow runs smoke → screenshots → Lighthouse sequentially

## What Each Check Validates

### Smoke Tests
- All routes return 200
- No console errors (warnings are recorded but not failed)
- No 404 resources
- All CTA links resolve correctly

### Screenshots
- Each project page renders correctly
- Hero + detail webp files are captured at 16:10
- File sizes are within expected range (20–50 KB)
- Visual content is present (not blank/white)

### Lighthouse
- Performance score recorded (not gated — informational)
- Accessibility score recorded
- Best Practices score recorded
- Reports saved to `reports/lighthouse/` with timestamps

## Interpreting Failures

| Failure Type              | Likely Cause                            | Action                              |
| ------------------------- | --------------------------------------- | ----------------------------------- |
| Console error (non-PostHog) | Uncaught exception, missing resource  | Fix before deploy                   |
| PostHog console error     | CDN asset 404 (benign)                  | Suppress — expected                 |
| Screenshot blank          | Rendering timeout, missing font load    | Rerun with longer wait              |
| Screenshot size < 5 KB    | Empty page or error state               | Investigate route                   |
| Bundle budget failure     | Dependency bloat, heavy import          | Run `npm run analyze`, prune        |

## QA Cadence

- **Every deploy**: smoke + Lighthouse (CI workflow dispatch)
- **Content changes only**: smoke only
- **Infrastructure changes**: full QA suite
- **Emergency hotfix**: smoke only

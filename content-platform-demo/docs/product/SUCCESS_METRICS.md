# Success Metrics

## Primary Metric

```
[Define the single most important metric.]
```

## Secondary Metrics

| Metric | Target | How Measured |
|---|---|---|
| [Metric name] | [Target value] | [Tool / method] |
| [Metric name] | [Target value] | [Tool / method] |
| [Metric name] | [Target value] | [Tool / method] |

## Quality Indicators

| Indicator | Standard | Check Method |
|---|---|---|
| Page performance | Lighthouse score >= 90 | Lighthouse CI |
| Accessibility | WCAG 2.1 AA | axe-core / Playwright |
| Error rate | < 1% of requests | Log analysis |
| Mobile usability | All routes tested at 390px | Playwright / manual |
| Build stability | 100% CI pass rate | CI pipeline |

## Failure Thresholds

| Condition | Action |
|---|---|
| Lighthouse score < 80 | Block deployment |
| A11y violations found | Fix before merge |
| Error rate > 5% | Rollback |
| Build fails | Fix before any other work |
| Visual regression detected | Investigate before merge |

# Release Policy

## Launch Freeze Rules

During a launch freeze, only the following are permitted:

- Security patches
- Critical bug fixes that block core functionality
- Content updates for active/in-flight projects

The following are prohibited during freeze:

- New pages or sections
- New dependencies
- Visual redesigns or layout changes
- Infrastructure or tooling changes

## Acceptable Changes (anytime)

- Bug fixes (no scope creep)
- Performance optimizations (measured, documented)
- Content updates (project additions, copy edits)
- Dependency patch updates
- Documentation updates

## Rollback Policy

- If a deploy introduces a regression, roll back immediately — do not attempt a hotfix on production.
- Use Vercel's instant rollback to the previous successful deployment.
- Fix the issue in a branch, run full QA, then deploy.

## Hotfix Policy

- Hotfixes bypass the full QA suite — smoke test only.
- A hotfix must be followed by a full QA run within 24 hours of deployment.
- Hotfix branches are named `hotfix/<short-description>`.
- Only one hotfix allowed per 48-hour window unless the previous hotfix introduced its own regression.

## Performance Regression Policy

- Bundle size increases >10% above baseline block deployment.
- Increases between 5–10% produce a warning and require documented justification.
- Lighthouse score drops >10 points from baseline require investigation before the next deploy.
- All regression decisions are made against the current baselines in `config/performance-budget.ts`.

## Versioning

- This project uses date-based informal versioning, not semver.
- A version is a deploy to production. Version labels are optional and documentary only.

## Escalation

- Design decisions: project owner
- Architecture decisions: project owner
- Dependency decisions: project owner
- Content decisions: project owner

# agents.md — QA & Agent Handover

> **Note:** This file was moved from `AGENTS.md` (project root) to `docs/agents.md` on 2026-06-02 as part of the docs consolidation. The QA policy is unchanged.

Purpose
-------
This document explains the release-validation pipeline and the remaining manual steps for human operators and automated agents. The goal: provide a reproducible, auditable QA gate that produces artifact-grade evidence (smoke logs, screenshots, Lighthouse reports).

Quick links
-----------
- QA workflow: .github/workflows/qa.yml (workflow_dispatch)
- Smoke script: scripts/smoke.js
- Screenshots script: scripts/screenshots.js
- Lighthouse script: scripts/lighthouse.js (requires Chrome + lighthouse)

How to run (recommended — CI)
----------------------------
1. Open the repository Actions tab → QA Pipeline → Run workflow.
2. Set `base_url` to a public preview or production URL (do NOT use localhost in CI).
3. Trigger. The run will produce uploaded artifacts for:
   - smoke-artifacts (logs/*.json + screenshot)
   - project-screenshots (public/projects/**/hero.webp)
   - project-screenshots-detail (public/projects/**/detail.webp)
   - lighthouse-reports (lighthouse/**)

Local runs (developer)
----------------------
- Use `npm run qa:smoke -- <URL>` and `npm run qa:screenshots -- <URL>` to generate the local artifacts.
- Lighthouse: install `lighthouse chrome-launcher` locally then run `npm run qa:lighthouse -- <URL>`.

Release gate rules (freeze)
---------------------------
- No new pages, sections, or components are to be merged after the "content freeze" commit until QA artifacts are produced and reviewed.
- QA artifacts must include:
  - Smoke logs: no PostHog `401` responses, `posthog.init()` runs only when key exists.
  - Project screenshots: 7 projects × 2 images (hero + detail), 1440×900, WebP, <300KB.
  - Lighthouse reports: JSON + HTML for `/`, `/projects/isp-platform`, `/services`, `/contact` with numeric metrics attached.

Interpretation rules
--------------------
- Lighthouse thresholds (recommended baseline): Performance >= 90, CLS < 0.05, LCP < 2.5s.
- If smoke test fails (console 500-level errors or missing UI), the pipeline must be re-run only after the underlying issue is fixed.

Artifacts retention
-------------------
- Workflow stores artifacts for 7 days. If you need permanent archival, download artifacts and store them in a release folder or external storage.

FAQ
---
Q: Can CI use localhost? A: No. Use a public preview or production URL. For local-only runs, use the provided npm scripts on your machine.

Contact
-------
For changes to the QA pipeline, modify .github/workflows/qa.yml and ensure smoke -> screenshots -> lighthouse gating remains.

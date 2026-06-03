# Ticket: Navbar scroll-lock investigation — Deferred

Status: Deferred

Created: 2026-05-30

Owner: @dev

Reason:

Playwright `window.scrollY` menu-lock test reported `scrollY` changes when opening the mobile menu. However, a targeted visual audit across mobile widths (360, 375, 390, 412) shows no visible page shift. DOM bounding-box checks and screenshot comparisons also show no user-visible movement.

Conclusion:

This is likely an implementation detail (Lenis virtualized scroll) rather than a user-facing defect. Defer further navbar scroll-lock work unless the issue is reproduced on physical devices (iPhone Safari / Android Chrome).

Re-open criteria:

- Reproduction on physical device showing visible content movement when menu is open.
- New flaky regressions reported by users after deployment that point to background scroll when menu is active.

Notes:

- Existing Playwright tests referencing `window.scrollY` should be reviewed and possibly relaxed or removed, but per direction this work is deferred.

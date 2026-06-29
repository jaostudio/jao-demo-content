# Local Dev Gate

## Purpose

Ensure code is correct, type-safe, and buildable before committing.

## Required Commands

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

All must pass with zero errors.

## Manual Checks

- [ ] Dev server starts without errors
- [ ] Hot reload works
- [ ] No console errors in browser
- [ ] No network errors in browser
- [ ] Affected route loads correctly

## Pass Criteria

```
- typecheck: 0 errors
- lint: 0 errors, 0 warnings
- test: all passing
- build: 0 errors
- Browser: no console/network errors
```

## Fail Actions

| Failure | Action |
|---|---|
| typecheck error | Fix type issues, do not disable strict mode |
| lint error | Fix lint violation, do not disable the rule |
| test failure | Fix the code or the test — do not delete the test |
| build error | Fix build before any other work |
| Console error | Investigate and fix |
| Network error | Investigate and fix |

## Escalation

If any command fails and you cannot fix it within 30 minutes:

1. Revert the change.
2. Document what went wrong.
3. Create a task packet for the fix.
4. Resume from a clean state.

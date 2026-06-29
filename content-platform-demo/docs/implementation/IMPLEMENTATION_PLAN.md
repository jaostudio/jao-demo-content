# Implementation Plan

## Scope

```
[One paragraph describing what this implementation phase covers.]
```

## Prerequisites

```
- [ ] Design contract finalized
- [ ] Architecture decisions documented
- [ ] Dependencies installed
- [ ] Environment configured
```

## Task Packets

### Packet 1: [Title]

```
Goal:     [One sentence]
Files:    [List of files to create/modify]
Out of scope: [What not to touch]
Acceptance: [Testable criteria]
```

### Packet 2: [Title]

```
Goal:     [One sentence]
Files:    [List of files to create/modify]
Out of scope: [What not to touch]
Acceptance: [Testable criteria]
```

### Packet 3: [Title]

```
Goal:     [One sentence]
Files:    [List of files to create/modify]
Out of scope: [What not to touch]
Acceptance: [Testable criteria]
```

## Ordering Rules

```
- Core layout before page content.
- Shared components before feature-specific components.
- Data layer before UI that depends on it.
- Auth before protected routes.
- Error states during initial implementation, not as a separate pass.
- Responsive behavior implemented alongside desktop, not as a separate pass.
```

## Verification Plan

```
- [ ] npm run typecheck
- [ ] npm run lint
- [ ] npm run test
- [ ] npm run build
- [ ] Route smoke tests
- [ ] Mobile QA (390px)
- [ ] Tablet QA (768px)
- [ ] Desktop QA (1440px)
- [ ] Screenshots captured
```

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| [Risk] | [H/M/L] | [H/M/L] | [Mitigation] |
| [Risk] | [H/M/L] | [H/M/L] | [Mitigation] |

# Internationalization Policy

> **Last updated:** 2026-06-02
> **Audience:** Agents and humans editing translations, translation contracts, or i18n tooling

## TL;DR

Translation coverage is **not** a metric to maximize. The site is bilingual (English / Tagalog) and runs `npm run i18n:check` on every meaningful change. Some namespaces are **intentionally English-dominant** because the audience reads English for technical content. Do not "fix" these by force-translating them.

## Coverage Is Not The Goal

The `i18n:check` script enforces:
- Coverage threshold (65% — see "Roadmap Targets" below)
- Valid contracts
- Funnel QA
- CTA consistency
- Orphan detection

The coverage threshold exists to prevent silent gaps in **user-facing conversion content** (Hero, Contact, Footer, Process, FAQ). It is not a target to maximize. Hitting 100% by force-translating technical jargon is worse than 68% with intentional English.

### Roadmap: Quality Over Coverage

Coverage percentage is a **misleading metric**. A TL locale at 95% translation density can feel machine-translated. A locale at 60% with intentional English for industry terms and natural Taglish for narrative copy can feel like a real Filipino founder wrote it.

**The goal is not to maximize translation count. The goal is:**

- Naturalness — does this sound like a Filipino business owner speaking?
- Readability — can the reader parse it quickly?
- Conversion — does it build trust and drive action?
- Credibility — does it match what the audience expects from a premium agency?

The coverage threshold (currently ~65%) exists as a **guardrail** to prevent silent gaps in user-facing conversion content (Hero, Contact, Footer, Process, FAQ). It is not a target to maximize. See "Forbidden Patterns" below.

## Locale Switch Behavior

The locale switch is **hard navigation**, not client-side replacement:

```
user clicks EN/TL
  → text morph on the toggle label
  → exit animation on #main-content
  → window.location.href = buildLocaleHref(nextLocale, pathname)
  → full page navigation
  → new locale page renders
```

This is implemented in `src/components/layout/navbar.tsx:36-68`. It is **stable and intentional**. Do not:
- Replace it with client-side dictionary swapping
- Add SPA-style navigation between locales
- Cache translations client-side as a route change optimization

If a user reports a perceived issue with the hard nav, the right response is to verify the animation is smooth, not to redesign the routing.

## EN-Dominant Namespaces

The following namespaces are **intentionally English-dominant**. The TL dictionary contains the same English values verbatim, and that is correct.

| Namespace | Reason |
|---|---|
| `tech` | Technology names, library names, infrastructure labels — technical buyers expect English |
| `projectDetail` | Project case studies contain product names, framework names, metric labels |
| `playground` | Demo labels and technical UI affordances |
| `metrics` | Lighthouse, CLS, LCP, kB, etc. — universal measurement vocabulary |
| `infrastructure` terms | "Rate limit", "rate-limited", "deployment", "rollout" — English-standard for the audience |
| `socialProof` (added P4 2026-06-02) | Tech credentials ("95+ Lighthouse", "SEO-optimized", "Responsive-first", "Production-ready", "Modern Stack", "Fast Delivery") read the same in both locales — appropriate for a "tech-credential strip" use case. The 0% TL coverage is **intentional**. |
| Stack philosophy labels | "Concern / Choice / Reasoning" table headers in `/studio` |
| Architecture diagram labels | "Orchestrator", "Platform", "Pipeline", "Inference", "Data" |
| Node graph node names | `nodeToStep` keys in `process-scrollytelling.tsx` and `system-provider.tsx` |
| `contactPage.model3`–`model6` ("Retainer", "Consulting", "Design Collaboration", "Quick Fix") | Engagement-industry standard terms. `model3`–`model4` documented in `src/i18n/domains/marketing.ts` as English-tolerated. `model5`–`model6` kept English per P5 locale polish. |

If you find yourself writing `t('Lighthouse')` or `t('Next.js')`, the answer is almost always: **don't**. Use the literal string. The glossary in `src/i18n/domains/marketing.ts` documents which marketing terms get TL translations and which stay English.

## EN-Tolerated (mixed Taglish)

The `contactPage` engagement models use a deliberate split:

| Key | TL Value | Rationale |
|-----|----------|-----------|
| `model1` | Buong Proyekto | Describes relationship structure — reads naturally in Filipino |
| `model2` | Naka-Fase | Describes engagement structure — immediately understandable |
| `model3`–`model6` | Retainer / Consulting / Design Collaboration / Quick Fix | Industry-standard offering names — kept English per locale policy |

The split is intentional. `model1`–`model2` describe *how* the engagement is structured (a relationship concept); `model3`–`model6` describe *what* the engagement delivers (a product category). The former benefits from TL localization; the latter does not.

## TL-Priority Namespaces

The following are **priority translation surfaces**. These must have high-quality TL coverage:

| Namespace | Why |
|---|---|
| `hero` | First-impression content. Buyer-facing. |
| `contact` + `contactPage` | Conversion-critical. Form labels, error messages, FAQ answers. |
| `footer` | Legal and trust signals. |
| `process` (user-facing copy: step names, summaries, details) | The buyer journey explanation. |
| `navbar` | Visible in every viewport. |
| `faq` (in `contactPage`) | Objection handling. |
| `cta` (labels) | Conversion buttons. Enforced by `cta-consistency.js`. |

## Glossary Discipline

`src/i18n/domains/marketing.ts` is the source of truth for TL marketing terms. When adding new marketing copy:
1. Check whether the term is in the glossary.
2. If yes, use the TL form.
3. If no, decide: is this a marketing term (add to glossary with TL) or a technical/UI term (leave as English)?

Do not freelance TL translations per-component. Centralize them in the glossary.

## Forbidden Patterns

- **Forcing TL on technology names** — "Next.js" stays "Next.js", not "Susunod.js"
- **Translating measurement units** — "190 kB" stays "190 kB", not "190 kiloBytes"
- **Translating universal UI affordances** — "Send Inquiry" stays in English in some contexts; check glossary
- **Inline `t()` calls for literal English values** — if the value is English, use a literal
- **Patching TL to make coverage numbers look better** — coverage is a guardrail, not a goal

## When to Update This Doc

- Adding a new namespace that's intentionally English-dominant
- Adding a new namespace that requires TL priority
- Changing the locale switch behavior
- Changing the coverage threshold in `i18n:check`

## Related Files

- Glossary: `src/i18n/domains/marketing.ts`
- Contracts: `src/i18n/contracts/contracts.ts`
- Locale switch implementation: `src/components/layout/navbar.tsx:36-68`
- Hard-nav documentation: `docs/locale-policy.md`
- Coverage scripts: `scripts/translations-report.js`, `scripts/validate-contracts.js`, `scripts/funnel-qa.js`, `scripts/cta-consistency.js`, `scripts/orphan-detection.js`

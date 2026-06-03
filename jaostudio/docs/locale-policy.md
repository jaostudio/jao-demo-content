# Locale Translation Policy

> **Scope:** This file documents the **Taglish translation rules** for marketing copy. For higher-level i18n policy — coverage targets, EN-dominant namespaces, locale-switch behavior — see [i18n-policy.md](./i18n-policy.md).

## Taglish Rules

### Rule 1: Context Determines Language

| Context | Rule | Examples |
|---------|------|----------|
| UI labels | Translate | "Contact" → "Kontak", "Menu" → "Menu" |
| CTAs | Translate | "Start a Project" → "Simulan ang Proyekto" |
| Form fields | Translate | "Name" → "Name", "Email" → "Email" |
| Technical terms | Always English | "API", "SaaS", "Dashboard", "CRM" |
| Explanatory copy > 12 words | Taglish | "Custom web development para sa mga startup..." |
| Explanatory copy ≤ 12 words | Translate fully | "Built for performance" → "Ginawa para sa performance" |

### Rule 2: Technical Term Whitelist (Always Keep English)

```
AI, Automation, API, CRM, ERP, Analytics, Dashboard,
Workflow, SaaS, Web App, Mobile App, React, Next.js,
TypeScript, PostgreSQL, Infrastructure, DevOps, Performance, SEO
```

### Rule 3: Structural Consistency

- `and` → `at` (not `at saka`, not `at din`)
- `for` → `para sa` (not `para sa mga` when singular)
- `of` → `ng` (not `sa`)
- `or` → `o` (not `kay`)
- `to` → omitted or `sa` depending on context

### Rule 4: No School-Textbook Filipino

| Bad | Good |
|-----|------|
| "Pagtuklas at Estratehiya" | "Discovery at Strategy" |
| "Pasadyang Aplikasyon sa Web" | "Custom Web Application" |
| "Mga Pook-Sapot" | "Website" |
| "Talaan ng Pamamahala" | "Dashboard" |

### Rule 5: Readability Over Mechanical Constraints

Prefer English technical nouns. Prefer Filipino connectors where natural. Optimize for readability over consistency.
- Good: "Custom web development para sa mga startup at agency na nangangailangan ng fast turnaround."
- Bad: "Pasadyang pag-develop ng web para sa mga panimulang kompanya at ahensya."

### Rule 6: Conversion Copy Over Linguistic Purity

For lead generation pages (contact forms, audit requests, CTAs), prioritize conversion clarity over strict translation rules.

- Good: "Ano ang gusto mong buuin?" (natural, friendly)
- Bad: "Ilarawan ang iyong ninanais na sistemang pang-negosyo." (textbook, formal)
- Good: "Simulan ang Proyekto" (clear CTA)
- Bad: "Magsimula ng isang Proyekto" (unnecessary filler)

If a fully translated CTA underperforms the English version in clarity, keep it English.

### Rule 7: Hybrid Default

When in doubt, default to the form that sounds like a real Filipino agency, not a language textbook. If a fully translated phrase sounds unnatural, use Taglish.

### Rule 8: Brand Identifier Protection

Meta titles must include `JAOstudio` in both locales. Never remove brand identifiers during translation.

## Implementation Reference

The locale switch is implemented as a **hard navigation** in [`src/components/layout/navbar.tsx:36-68`](../../src/components/layout/navbar.tsx). The `toggleLocale` callback morphs the language label (`runTextMorph`), runs an exit animation on `#main-content` (`runExitAnimation`), sets a 1-year `NEXT_LOCALE` cookie, calls `markPendingEntry()` to coordinate the entry animation on the next page, then assigns `window.location.href` to navigate. The animation is skipped entirely under `prefers-reduced-motion: reduce` or if `#main-content` is missing — the cookie is set and navigation happens immediately.

This is intentional. A SPA-style client-side route change would require re-running every server component, re-running the i18n provider re-hydration, and would re-introduce the SSR/CSR boundary drift the hard-nav avoids. The cost is one full page transition; the benefit is that every page reload renders the correct locale, the correct server-rendered translations, and the correct `<html lang>` attribute from the very first byte. See [i18n-policy.md § Locale Switch Behavior](./i18n-policy.md#locale-switch-behavior) for the policy statement.

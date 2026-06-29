# Humanization Gate

## Purpose

Ensure the site feels project-specific, crafted, and intentionally designed — not generic, templated, or AI-generated.

## Prerequisites

- Design QA gate passed
- All routes screenshot-verified

## Copy Checks

- [ ] No generic AI marketing phrases ("Elevate your business", "Seamless experience", "Unlock your potential")
- [ ] Hero copy names the specific audience
- [ ] Primary promise is concrete
- [ ] Benefits are tied to actual user outcomes
- [ ] Claims are backed by proof (metric, screenshot, implementation detail, example)
- [ ] CTA text is specific to the action (not "Submit")
- [ ] Section headings are not interchangeable with another project
- [ ] Error, empty, and success states sound like the product
- [ ] No vague testimonials — if testimonials exist, they reference specific outcomes

## Visual Checks

- [ ] No fake logos, fake screenshots, or decorative filler assets
- [ ] Layout rhythm is not repetitive across every section (not hero→logos→features→testimonials→CTA on repeat)
- [ ] Visual motifs are tied to the project concept
- [ ] Screenshots or demos are real or clearly marked as demo
- [ ] Cards, icons, gradients, and badges have a purpose
- [ ] Typography and spacing feel intentional
- [ ] Mobile layout preserves the brand feel

## Interaction Checks

- [ ] Hover/focus states are consistent and intentional
- [ ] Motion is restrained and meaningful (not decorative)
- [ ] Loading states are designed (not browser default)
- [ ] Empty states provide next actions
- [ ] Error states are specific and recoverable
- [ ] Success states confirm what happened

## Proof Checks

- [ ] Each major claim has evidence
- [ ] Portfolio projects explain real decisions and tradeoffs
- [ ] Technical credibility is visible where useful
- [ ] The site does not rely on vague trust language ("Trusted by industry leaders")

## Pass Criteria

The site should not feel like it could be rebranded for any random business by changing only the logo and colors.

If someone could swap the logo and brand colors and have a working site for a different business, the humanization gate failed.

## Fail Actions

| Issue | Action |
|---|---|
| Generic AI copy | Replace with project-specific language from copy guide |
| Fake-looking testimonial | Remove or replace with specific, real feedback |
| Repetitive section structure | Vary layout rhythm |
| Weak proof | Add specific evidence or remove the claim |
| Decorative filler | Remove or justify with product rationale |
| Interchangeable headings | Rewrite to include project-specific nouns and verbs |

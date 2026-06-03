# Contact — Annotations (mobile)

Screenshots
- .opencode/screenshots/contact/360.png
- .opencode/screenshots/contact/390.png
- .opencode/screenshots/contact/412.png

High-priority visual issues

1. Primary CTA clipping / edge visibility
   - Observation: the submit button sits close to the bottom edge and previously was clipped by ancestor overflow. A portal-mounted fixed CTA was applied as an interim fix.
   - Evidence: .opencode/screenshots/contact/360.png shows CTA near bottom edge; compare with 390/412 to confirm safe area.
   - Suggested fix for design: prefer a full-width flush sticky CTA with safe-area padding (see code suggestion below). Keep CTA portal-mounted to avoid clipping by transformed ancestors.

2. Input touch-targets and bottom padding
   - Observation: Some inputs were <44px height prior to patch. Form content can be obscured by a fixed CTA without sufficient bottom padding.
   - Evidence: after patch inputs appear ~46px tall in screenshots; ensure `pb` on the form equals CTA height + safe-area inset.
   - Suggested fix: add `pb-[calc(56px+env(safe-area-inset-bottom))]` to the form container (Tailwind via arbitrary value), or `style={{paddingBottom: 'calc(56px + env(safe-area-inset-bottom))'}}`.

3. Contrast / hierarchy for success/error state
   - Observation: error panel uses soft background—ensure adequate contrast and visible focus when the keyboard opens.
   - Suggested fix: test with virtual keyboard open on iOS/Android to ensure message and inputs remain visible.

UX checks (interactive)
- Verify tapping inputs (name/email) opens keyboard without CTA covering the field.
- Confirm keyboard-close returns layout to original and CTA remains visible.
- Confirm form focus order and that portal CTA preserves `form="contact-form"` submission.

Implementation notes (for .opencode)
- Primary portal code: `src/components/sections/contact-section.tsx` includes `MobileFixedSubmit` (portal). Consider replacing with design-approved sticky CTA pattern and applying safe-area padding.
- Input sizes: standardize mobile input `py-4` and `min-height: 44px` in form theme tokens.

Quick CSS snippet

1) Form bottom padding (Tailwind arbitrary):

   - `class="pb-[calc(64px+env(safe-area-inset-bottom))] max-sm:pb-[calc(64px+env(safe-area-inset-bottom))]"`

2) Sticky CTA (portal-mounted) example:

   - container: `fixed left-0 right-0 bottom-0 pb-safe z-50 flex justify-center`
   - inner: `max-w-[720px] w-full px-4` then the full-width `Button`.

Attach any before/after screenshots when implementing to `../boards/contact`.
# Contact — Visual Audit Annotations

Screenshots: `.opencode/screenshots/contact-360x800.png`, `contact-390x844.png`, `contact-412x915.png`

Summary (perceived quality)
- Overall: Contact flows are present but could be optimized for one-thumb reach and immediate clarity.

Findings (annotated)
- Primary CTA (Contact) — Priority: High
  - Symptom: Primary contact button may be below the fold on 360; form fields appear compressed.
  - Perceptual effect: Users may abandon or need to scroll to find the form.
  - Suggested fix: Move primary contact CTA above fold; make main contact button sticky or prominent. Use large touch targets.

- Form UX — Priority: Medium
  - Symptom: Input fields have small vertical spacing and compact labels.
  - Perceptual effect: Harder to fill with thumb; accessibility concerns.
  - Suggested fix: Increase input height, add clear labels, and ensure easy keyboard focus.

- Alternative contact options — Priority: Low
  - Symptom: Secondary options (email link, social) are small and low-contrast.
  - Perceptual effect: Users may miss alternative contact channels.
  - Suggested fix: Surface one alternative call-to-action (email) with clear affordance.

Verification
- Ensure primary contact CTA reachable within thumb zone on 360 and that form fields meet 44–48px touch target guidance.
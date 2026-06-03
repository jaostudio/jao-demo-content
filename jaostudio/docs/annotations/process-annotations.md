# Process — Annotations (mobile)

Screenshots
- .opencode/screenshots/process/360.png
- .opencode/screenshots/process/390.png
- .opencode/screenshots/process/412.png

Observed issues

1. Scrollytelling step buttons and spacing
   - Observation: step numbers and their labels can feel cramped; step buttons may overlap near edges on narrow devices.
   - Suggested fix: ensure step buttons have `min-h-[44px]` and add `px-3` inner padding at ≤360.

2. Arrow/key hint visibility
   - Observation: small arrow hints or key-instructions may be too subtle; increase contrast or size for mobile.

3. Tap targets for interactive controls
   - Observation: controls that advance the scrollytelling sequence must be large enough for thumbs (44–48px recommended).

Interactive checks
- Use gestures and keyboard to cycle steps; ensure focus moves correctly and controls are reachable when the keyboard is open.

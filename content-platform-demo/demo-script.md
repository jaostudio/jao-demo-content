# Likha — Demo Script (3 minutes)

## 1. Opening (15s)

> *Screen: Likha homepage — gallery feed showing published articles*

**Narrator:**
"Likha is an AI‑free creative publishing platform built for communities. Watch me draw a piece of art, publish it, moderate it, and engage with it — all in under two minutes."

---

## 2. Draw, Declare, Publish (60s)

> *Click **Write** (green accent button, top‑right header).*

**Narrator:**
"I'll start by creating a new piece. I click Write — and I'm in the article form."

> *Click **Drawing** in the format pill selector.*

**Narrator:**
"The first choice is format. I select Drawing — and the canvas editor appears."

> *Draw a quick sketch on the canvas (e.g., a simple sun + mountain). Use green brush, then switch to eraser to clean up a stroke.*

**Narrator:**
"The canvas tool supports brush color, size, and eraser. It's built on native Canvas API — no third‑party dependencies, no AI generation, just human input."

> *Click **"Set as Thumbnail"** — green dot confirms "Drawing saved (X KB)".*

**Narrator:**
"I set it as the thumbnail. The data stays as base64 in the database — simple for demos, swappable for file storage in production."

> *Check the **AI‑free checkbox**, type title "Sunset Over Mt. Makiling", select category, click **Publish**.*

**Narrator:**
"I check the AI‑free declaration — this is Likha's trust signal. Every piece tagged AI‑free gets a sparkle badge. I add a title, pick a category, and publish."

---

## 3. Moderate — Admin Approval (30s)

> *Switch to **admin@content.dev** in the demo role switcher (bottom‑right corner).*

**Narrator:**
"Now I'll switch to the Admin role."

> *Header shows **Admin** button. Click it to open dashboard.*

**Narrator:**
"The dashboard shows the new drawing in Drafts. I can see the format column — Drawing — and the AI‑free indicator."

> *Click article edit, approve / transition to Published.*

**Narrator:**
"I open the draft and approve it. A single click moves it from Draft to Published."

---

## 4. Gallery & Engagement (30s)

> *Return to homepage. The new drawing is now featured at the top.*

**Narrator:**
"Back on the homepage, the drawing appears in the gallery feed — full‑width image, format badge, and the green AI‑free sparkle icon."

> *Click into the article. Click the **heart icon** to like. Scroll to comments.*

**Narrator:**
"Readers can like — tracked per article with a simple localStorage toggle — and leave comments. No account needed to engage."

---

## 5. Stubs — Video & Audio (20s)

> *Create a new article. Click **Video** in the format selector.*

**Narrator:**
"If I select Video or Audio..."

> *Toast appears: "Coming soon — video and audio upload will be available in the full version."*

**Narrator:**
"...the UI shows a clear 'Coming soon' placeholder. The architecture supports it — we're just stubbing the capture and transcoding for the demo."

---

## 6. Bilingual — Taglish Toggle (15s)

> *Click the locale switcher, switch to Filipino.*

**Narrator:**
"Likha is bilingual. The UI switches to Taglish — headers, footers, and form labels all translate via next‑intl."

---

## 7. Wrap (10s)

> *Pause on the homepage showing the gallery with the drawing, badges, likes.*

**Narrator:**
"Likha is ready for your community. AI‑free, canvas‑first, gallery‑tight. Deploy it today."

---

## Technical Notes for Recording

| Element | Action |
|---------|--------|
| **Canvas drawing** | Keep it simple — 3 strokes, 2 colors. Demo‑worthy, not artistic. |
| **Role switcher** | Visible at bottom‑right in new layout. Ensure you're on the demo credentials page first. |
| **Credentials** | `admin@content.dev` / `password123` — Admin role |
| **Credentials** | `sarah@content.dev` / `password123` — Author role |
| **Locale** | Toggle from EN → FIL using the globe icon in the header. |
| **Screen size** | Record at 1440×900 or 1280×800 — three‑column layout visible. |

## Toast Style Ref (Zora)

| Toast Type | Style |
|------------|-------|
| Success | Green accent (btn-accent) |
| Info/Coming soon | Dark fill (btn-dark) |
| Error | Red (btn-danger) |

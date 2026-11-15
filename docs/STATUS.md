# Status

## 2026-11-15
- Done: project docs set up (CLAUDE.md, MANAGER.md rewrite, docs/ brief, decisions, CV content). git initialised.
- Done: motion, extras and .NET Core picked (see DESIGN-BRIEF). 3 look mockups built in `mockups/` (served at http://127.0.0.1:8765/ by worker W-style mockups).
- Round 1 looks rejected (too generic). Round 2 built in `mockups/round2/` (Shadow & Light, Blue Hour, Signal); Luke picking via inbox card. Unverified on mockups: console, keyboard, live mouse effects. Condensed font is Windows-only in mockups (the real build self-hosts its fonts).
- Added AI section (draft: `docs/content/ai.md`).
- Waiting on Luke: confirm the AI content + whether opcode can be shown, GitHub username for the portfolio, photo yes/no.
- Mockup notes for the real build: make the hero diagram flow top to bottom on phones; the console, reduced-motion and keyboard checks weren't done on the mockups.
- PAUSED 2026-11-15 ~11:30: plan budget line reached (5h 91%). No workers until usage resets.
  Worker W-style mockups (session 0342fc7d) is idle; its Python server on :8765 runs up to 2h, then stops.
  To view mockups after that: `cd mockups && python -m http.server 8765 --bind 127.0.0.1`.
- DONE: Luke picked Shadow & Light (D-004); other mockups scrapped (git e73b9b5 has them). Multi-page + sticky name + manager improvements decided (D-005 to D-007).
- HELD: worker W-M1 (brief in `docs/briefs/W-M1-astro-scaffold.md`) can't start: a worker account was unavailable (opcode 'Log in again' card). Start it once the login works.
- Next (frontend manager): once the style is picked, record the pick in DESIGN-BRIEF + DECISIONS D-004, then start worker 1 "Scaffold Astro site + design tokens + base
  layout" in `site/` (port the chosen mockup's tokens/effects; self-hosted condensed font to replace Bahnschrift). Then the hero and sections, then case-study pages, then a polish/a11y/Lighthouse pass.
- Milestones: M1 scaffold + tokens · M2 single page with all sections · M3 case-study pages · M4 polish
  (dark mode, motion, SEO, a11y) · M5 hosting (only after Luke says "ready to host").

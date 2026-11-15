# Board

Overview board for the Portfolio project. opcode reads its tracker files: `docs/open-checks.md`, `WAITING.md`,
`GUESSES.md`. This file keeps the Backlog and Done columns. Managers keep it current (MANAGER.md ST-BOARD).

Format (stable, one item per line, so it can be parsed):
`- [ID] Title | owner: <who> | links: <files/commits/cards> | note: <short>`
- Sections are the columns, in this order: In progress · Open checks · Waiting on Luke · Blocked · Backlog · Done.
- IDs: `M<n>` milestone, `F-<n>` fix, `CHK-<n>` open check (not yet verified), `Q-<n>` question for Luke
  (numbers match docs/QUESTIONS-FOR-LUKE.md), `B-<n>` blocker.
- Moving an item = cut the line and paste it under the new section, then update the note. Never reuse an ID.

## In progress / Open checks
See `docs/open-checks.md`.

## Waiting on Luke / Blocked
See `WAITING.md`. Unconfirmed assumptions: `GUESSES.md`.

## Backlog
- [M3] Case studies v2: fill in Luke's answers (Q-1..Q-10), add diagrams per case study | owner: frontend manager | links: - | note: after Luke answers
- [M3b] GitHub repos section (chosen extra) | owner: frontend manager | links: DESIGN-BRIEF §6 | note: needs Q-14
- [M4 → in progress, see docs/open-checks.md] Polish: dark/OG preview image, Lighthouse, a11y pass, real-device + cross-browser checks (CHK-1..5) | owner: frontend manager | links: - | note: -
- [M5] Hosting: Cloudflare Pages via Terraform + GitHub Actions (D-003) | owner: Luke decides | links: docs/DECISIONS.md | note: only after "ready to host"; B-1 and B-2 first

## Done
- [M0] Project docs, rules, decisions | owner: frontend manager | links: CLAUDE.md, MANAGER.md, docs/ | note: 2026-11-15
- [M0b] Look picked: Shadow & Light (2 mockup rounds) | owner: Luke | links: D-004, mockups/round2/ | note: 2026-11-15
- [M1] Astro scaffold, shell, sticky name, spotlight, home, palette, sitemap | owner: W-M1 | links: commit 65a2fa4, docs/screens/m1/ | note: reviewed
- [M2] Content pages (work + 4 case studies, experience, AI, about, built, contact) | owner: W-M2 | links: commit 22fb6c2, docs/screens/m2/ | note: reviewed
- [F-1..F-4] M2 review fixes: titles fit on phones, first-person voice, shorter experience, preview on :4321 | owner: W-M2 | links: commit 214cb0d, docs/screens/m2-fix/ | note: manager-checked 320/390 screenshots
- [T-1] Luke tested M1 + M2 in his browser: Tested OK (also closes CHK-6, live mouse effects) | owner: Luke | links: inbox card c17947417330389427c82b | note: 2026-11-15
- [CHK-5] Contrast measured: 1499 text elements, 26 page states, 0 below AA, lowest 5.95:1 | owner: W-M4 | links: docs/screens/m4/contrast.txt, site/tools/contrast.mjs | note: 2026-11-15
- [CHK-7] Permissions-Policy warnings come from add-on on this PC, not the site | owner: W-M4 | links: docs/screens/m4/NOTES.md | note: 2026-11-15
- [CHK-2a] Firefox matches Edge (heights within 2px, console clean); Safari still open as CHK-2 | owner: W-M4 | links: docs/screens/m4/xbrowser/ | note: 2026-11-15
- [M4] Polish + audits: OG cards, favicon, a11y/contrast/weight/print/Firefox, CHK-4 Lighthouse still blocked | owner: W-M4 | links: docs/screens/m4/NOTES.md | note: 2026-11-15
- [CHK-4] Lighthouse: mobile perf 97-99, desktop 100, a11y 100, SEO 100, best practices 81 (only local browser add-ons http requests); no code change kept | owner: W-M4 | links: docs/screens/m4/lighthouse/README.md | note: 2026-11-15

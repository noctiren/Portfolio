# Board

Issue board for the Portfolio project, synced by opcode. Managers keep it current (MANAGER.md ST-BOARD).

Format (stable, one item per line, so it can be parsed):
`- [ID] Title | owner: <who> | links: <files/commits/cards> | note: <short>`
- Sections are the columns, in this order: In progress · Open checks · Waiting on Luke · Blocked · Backlog · Done.
- IDs: `M<n>` milestone, `F-<n>` fix, `CHK-<n>` open check (not yet verified), `Q-<n>` question for Luke
  (numbers match docs/QUESTIONS-FOR-LUKE.md), `B-<n>` blocker.
- Moving an item = cut the line and paste it under the new section, then update the note. Never reuse an ID.

## In progress
- [F-1] Fit giant titles on phones (/experience broke mid-word) | owner: W-M2 content pages | links: docs/screens/m2/experience-390.png | note: fix sent 2026-11-15
- [F-2] First-person voice everywhere (case studies said "Luke") | owner: W-M2 content pages | links: site/src/content/work/ | note: wording only, no fact changes
- [F-3] Experience: 3 bullets per job + "Full details" expander | owner: W-M2 content pages | links: site/src/pages/experience.astro | note: -
- [F-4] Leave a preview running on :4321 for Luke | owner: W-M2 content pages | links: - | note: after F-1 to F-3

## Open checks
- [CHK-1] Real phone / touch device test (spotlight follows taps, menu, tilt off) | owner: frontend manager | links: - | note: only emulated so far
- [CHK-2] Safari + Firefox check | owner: frontend manager | links: - | note: only Edge/Chromium so far
- [CHK-3] Screen reader pass | owner: frontend manager | links: - | note: planned for M4
- [CHK-4] Lighthouse (perf/a11y/SEO/best practices) | owner: frontend manager | links: - | note: planned for M4
- [CHK-5] Colour contrast measured with a tool | owner: frontend manager | links: site/src/styles/tokens.css | note: AA by token choice, not measured
- [CHK-6] Live mouse effects (spotlight follow, magnetic buttons, card tilt) seen by a human | owner: Luke | links: http://127.0.0.1:4321/ | note: the side browser can't move a mouse
- [CHK-7] Console "Permissions-Policy" warnings in headless runs | owner: frontend manager | links: docs/screens/m2/verify-log.txt | note: believed to come from the headless browser, not the site

## Waiting on Luke
- [Q-1..Q-10] Case-study details (before-state, scale numbers, how it was done) | owner: Luke | links: docs/QUESTIONS-FOR-LUKE.md | note: shown as TODO(Luke) boxes on the /work pages
- [Q-11] Confirm/trim the AI list, the "few other things", AI at ixo | owner: Luke | links: docs/content/ai.md | note: /ai shows a draft badge until then
- [Q-12] OK to show opcode? How much; repo/screens/demo? | owner: Luke | links: docs/content/ai.md | note: -
- [Q-13] Photo on /about: yes/no | owner: Luke | links: site/src/pages/about.astro | note: -
- [Q-14] GitHub username | owner: Luke | links: footer, /contact | note: needed for the GitHub repos extra
- [CARD] Approve stopping W-M2's leftover preview server (PID 38836, :4322) | owner: Luke | links: inbox card c179474127822557f297ea | note: safe to approve

## Blocked
- [B-1] Hosting blocked: CV PDF contains the phone number (HR-PRIVACY) | owner: Luke | links: site/public/Luke_Petzer_CV.pdf, Q-15 | note: need a phone-free CV or explicit OK
- [B-2] Hosting blocked: no domain yet | owner: Luke | links: site/astro.config.mjs, Q-16 | note: placeholder lukepetzer.example

## Backlog
- [M3] Case studies v2: fill in Luke's answers (Q-1..Q-10), add diagrams per case study | owner: frontend manager | links: - | note: after Luke answers
- [M3b] GitHub repos section (chosen extra) | owner: frontend manager | links: DESIGN-BRIEF §6 | note: needs Q-14
- [M4] Polish: dark/OG preview image, Lighthouse, a11y pass, real-device + cross-browser checks (CHK-1..5) | owner: frontend manager | links: - | note: -
- [M5] Hosting: Cloudflare Pages via Terraform + GitHub Actions (D-003) | owner: Luke decides | links: docs/DECISIONS.md | note: only after "ready to host"; B-1 and B-2 first

## Done
- [M0] Project docs, rules, decisions | owner: frontend manager | links: CLAUDE.md, MANAGER.md, docs/ | note: 2026-11-15
- [M0b] Look picked: Shadow & Light (2 mockup rounds) | owner: Luke | links: D-004, mockups/round2/ | note: 2026-11-15
- [M1] Astro scaffold, shell, sticky name, spotlight, home, palette, sitemap | owner: W-M1 | links: commit 65a2fa4, docs/screens/m1/ | note: reviewed
- [M2] Content pages (work + 4 case studies, experience, AI, about, built, contact) | owner: W-M2 | links: commit 22fb6c2, docs/screens/m2/ | note: reviewed; fixes F-1..F-4 in progress

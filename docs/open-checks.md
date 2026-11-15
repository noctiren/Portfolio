# Open checks: Portfolio (frontend)

Things not yet verified, plus work in progress. Synced by opcode. Line format:
`- [ID] Title | owner: <who> | links: <...> | note: <...>`. Remove a line when it's closed and log it under Done in docs/BOARD.md.

## In progress
- [F-1] Fit giant titles on phones (/experience broke mid-word) | owner: W-M2 content pages | links: docs/screens/m2/experience-390.png | note: fix sent 2026-11-15
- [F-2] First-person voice everywhere (case studies said "Luke") | owner: W-M2 content pages | links: site/src/content/work/ | note: wording only
- [F-3] Experience: 3 bullets per job + "Full details" expander | owner: W-M2 content pages | links: site/src/pages/experience.astro | note: -
- [F-4] Leave a preview running on :4321 for Luke | owner: W-M2 content pages | links: - | note: after F-1 to F-3

## Open checks
- [CHK-1] Real phone / touch device test (spotlight follows taps, menu, tilt off) | owner: frontend manager | links: - | note: only emulated so far
- [CHK-2] Safari + Firefox check | owner: frontend manager | links: - | note: only Edge/Chromium so far
- [CHK-3] Screen reader pass | owner: frontend manager | links: - | note: M4
- [CHK-4] Lighthouse (perf/a11y/SEO/best practices) | owner: frontend manager | links: - | note: M4
- [CHK-5] Colour contrast measured with a tool | owner: frontend manager | links: site/src/styles/tokens.css | note: AA by token choice, not measured
- [CHK-6] Live mouse effects (spotlight follow, magnetic buttons, card tilt) seen by a human | owner: Luke | links: http://127.0.0.1:4321/ | note: the side browser can't move a mouse
- [CHK-7] Console "Permissions-Policy" warnings in headless runs | owner: frontend manager | links: docs/screens/m2/verify-log.txt | note: believed to come from the headless browser

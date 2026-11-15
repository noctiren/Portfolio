# Open checks: Portfolio (frontend)

Things not yet verified, plus work in progress. Synced by opcode. Line format:
`- [ID] Title | owner: <who> | links: <...> | note: <...>`. Remove a line when it's closed and log it under Done in docs/BOARD.md.

## In progress
- [M4] Polish + audits (OG image, favicon, contrast CHK-5, Firefox CHK-2, a11y pass, page weight) | owner: W-M4 polish + audits | links: docs/briefs/W-M4-polish.md | note: started 2026-11-15

## Open checks
- [CHK-1] Real phone / touch device test (spotlight follows taps, menu, tilt off) | owner: frontend manager | links: - | note: only emulated so far
- [CHK-2] Safari + Firefox check | owner: frontend manager | links: - | note: only Edge/Chromium so far
- [CHK-3] Screen reader pass | owner: frontend manager | links: - | note: M4
- [CHK-4] Lighthouse (perf/a11y/SEO/best practices) | owner: frontend manager | links: - | note: M4
- [CHK-5] Colour contrast measured with a tool | owner: frontend manager | links: site/src/styles/tokens.css | note: AA by token choice, not measured
- [CHK-7] Console "Permissions-Policy" warnings in headless runs | owner: frontend manager | links: docs/screens/m2/verify-log.txt | note: believed to come from the headless browser

## Notes
- Preview servers started by workers stop after at most 2 hours (opcode's background limit). If http://127.0.0.1:4321/
  doesn't load, run `cd site && npm run dev` (or ask the manager to have one started).

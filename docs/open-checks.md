# Open checks: Portfolio (frontend)

Things not yet verified, plus work in progress. Synced by opcode. Line format:
`- [ID] Title | owner: <who> | links: <...> | note: <...>`. Remove a line when it's closed and log it under Done in docs/BOARD.md.

## In progress

## Open checks
- [CHK-1] Real phone / touch device test (spotlight follows taps, menu, tilt off) | owner: frontend manager | links: - | note: only emulated so far
- [CHK-2] Safari check | owner: frontend manager | links: docs/screens/m4/NOTES.md | note: Firefox done in M4 (matches Edge); Safari needs a Mac/iPhone
- [CHK-3] Screen reader pass | owner: frontend manager | links: - | note: M4
- [CHK-4] Lighthouse (perf/a11y/SEO/best practices) | owner: frontend manager | links: D-008 | note: Luke approved, but the Claude Code permission check blocked `npm install --save-dev lighthouse` twice; needs a permission rule or Luke runs the install

## Notes
- Preview servers started by workers stop after at most 2 hours (opcode's background limit). If http://127.0.0.1:4321/
  doesn't load, run `cd site && npm run dev` (or ask the manager to have one started).

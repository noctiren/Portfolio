# Open checks: Portfolio (frontend)

Things not yet verified, plus work in progress. Synced by opcode. Line format:
`- [ID] Title | owner: <who> | links: <...> | note: <...>`. Remove a line when it's closed and log it under Done in docs/BOARD.md.

## In progress
- [M6] Alive touches + /recruiter page | owner: W-M6 | links: docs/briefs/W-M6-alive-recruiter.md, D-009 | note: started 2026-11-15

## Open checks
- [CHK-1] Real phone / touch device test (spotlight follows taps, menu, tilt off) | owner: Luke | links: - | note: only emulated so far
- [CHK-2] Safari check | owner: frontend manager | links: docs/screens/m4/NOTES.md | note: Firefox done in M4 (matches Edge); Safari needs a Mac/iPhone
- [CHK-3] Screen reader pass (Windows Narrator: Win+Ctrl+Enter) | owner: Luke | links: - | note: automated a11y checks all pass; needs a human

## Notes
- Preview servers started by workers stop after at most 2 hours (opcode's background limit). If http://127.0.0.1:4321/
  doesn't load, run `cd site && npm run dev` (or ask the manager to have one started).

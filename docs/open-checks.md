# Open checks: Portfolio (frontend)

Things not yet verified, plus work in progress. Synced by opcode. Line format:
`- [ID] Title | owner: <who> | links: <...> | note: <...>`. Remove a line when it's closed and log it under Done in docs/BOARD.md.

## In progress

## Open checks
- [T-2] Luke tests M6 in his browser (alive touches + /recruiter) | owner: Luke | links: ready_to_test card, docs/screens/m6/ | note: dev server running on :4321
- [CHK-1] Real phone / touch device test (spotlight follows taps, menu, tilt off) | owner: Luke | links: - | note: only emulated so far
- [CHK-2] Safari check | owner: frontend manager | links: docs/screens/m4/NOTES.md | note: Firefox done in M4 (matches Edge); Safari needs a Mac/iPhone
- [CHK-3] Screen reader pass (Windows Narrator: Win+Ctrl+Enter) | owner: Luke | links: - | note: automated a11y checks all pass; needs a human

## Notes
- Preview servers started by workers stop after at most 2 hours (opcode's background limit). If http://127.0.0.1:4321/
  doesn't load, run `cd site && npm run dev` (or ask the manager to have one started).

# MANAGER.md: Portfolio

Rewritten 2026-11-15 by the Frontend manager after Luke handed over organising the project. Sources: Luke's
message of 2026-11-15 ("I'll let you organize the docs ... you + a backend manager will be driving it, asking
what style I want or giving recommendations ... all local, will host when I say we are ready") and `CLAUDE.md`.
`CLAUDE.md` hard rules override this file.

## 1. Start
- ST-READ: Read `CLAUDE.md`, then `docs/BOARD.md`, `docs/STATUS.md`, `docs/DECISIONS.md` and `docs/DESIGN-BRIEF.md`.
- ST-BOARD: `docs/BOARD.md` is the issue board (opcode syncs it). On every change of state (worker started,
  reported, fix sent, check done, Luke answered), move or add the item there in its fixed line format.
  Workers report state changes to the manager; the manager edits the board.
- ST-STATUS: Before ending a work session, update `docs/STATUS.md` with what is done, what is next and what is
  waiting on Luke.

## 2. May answer for the owner (go-ahead grant on)
- AA-GOAHEAD: A worker finishes a step and asks to continue with the next planned step or task in its area: yes.
- AA-DECIDE: Implementation and structure choices (components, file layout, CSS approach within the approved
  stack, refactors, wording of UI labels), plus picking between options that `docs/DESIGN-BRIEF.md` has already
  settled. Make the call, give the reason, and log anything non-trivial in `docs/DECISIONS.md`.
- AA-INSTALL-APPROVED: Installing packages that `docs/DECISIONS.md` lists as approved.

## 3. Always send to the owner
- OW-STYLE: Visual direction (palette, fonts, overall look, how much animation, new sections or pages). Always
  attach a recommendation. Luke asked to be consulted on these.
- OW-CONTENT: Any claim about Luke's work or life that isn't in `docs/content/cv.md`, plus project write-ups
  and the photo.
- OW-INSTALL: New dependencies or tools that aren't on the approved list.
- OW-SHIP: Deploying, publishing, pushing to a remote, domains, hosting accounts, anything that costs money
  (HR-LOCAL).
- OW-DELETE: Permanent deletes of anything Luke made, such as CV or content files.
- OW-GUESS: Guesses about facts. Ask; don't fill in.

## 4. Hard rules
See `CLAUDE.md`: HR-LOCAL, HR-INSTALL, HR-FACTS, HR-PRIVACY, HR-A11Y.

## 5. Picking model + effort for a worker
The cap is opus/medium, so every tier runs at medium at most. Mechanical (copy edits, renames): haiku/medium.
Everything else (components, pages, design passes, audits): opus/medium. A worker brief names the files it
owns, the docs to read, and the verification steps from `CLAUDE.md`.

## 6. Checking a worker's report
- RP-MIN: The report lists the changed files and how they were verified.
- RP-WEB: For UI changes, the report includes desktop and mobile screenshots, states that the console is
  clean, and notes reduced motion where animation was touched. No screenshot means not verified: send the
  worker back.
- RP-FACTS: Content changes are checked against `docs/content/cv.md` (HR-FACTS).

## 7. Locks
- `npm install` and edits to `package.json` / lockfiles: one worker at a time (claim_lock `site/package.json`).
- One dev server at a time on port 4321. Whoever starts it stops it.

## 8. Modes
- NORMAL: do the task, report, stop.
- AFK: after the task, close small open items in the same area (polish, a11y fixes, responsive bugs). Never
  start a new milestone and never touch section 3 items. Stop at Luke's stop point.

## 9. Do not trust
- `.opcode/suggested-profiles.json` is from the empty-folder setup and is out of date. This file wins.
- Stale numbers: the CV is dated 2026-11; confirm with Luke before updating metrics.

## 10. Areas
- frontend (Frontend manager): `site/**`, `docs/DESIGN-BRIEF.md`, `docs/content/**`, `docs/STATUS.md`,
  `docs/DECISIONS.md`. Cap opus/medium.
- backend (no manager yet): only if a backend is ever needed (D-002 says not for now). It would own `api/**`.
- infra/hosting (later, Luke's call): Terraform for hosting under `infra/**`, only after "ready to host".

## 11. Routing work between managers
- Everything currently goes to the Frontend manager. If D-002 is reopened (for example a contact-form API),
  pass the API part to a backend manager with hand_over.

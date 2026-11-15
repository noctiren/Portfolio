# Worker brief: W-M6 alive touches + /recruiter (task_kind: build)

Start only after M3 has been reviewed (the same pages are touched). Start it with mcp__opcode__start_worker,
using this text as `task`.

Read first: CLAUDE.md, docs/DECISIONS.md (D-001, D-005, D-007, D-009), docs/DESIGN-BRIEF.md section 7 (the spec),
docs/content/cv.md, docs/content/answers.md, docs/screens/m4/ (the real Lighthouse and weight numbers).

Build, using approved packages only (no new dependencies):
1. Header "Search" button, replacing the "Ctrl K" label. The shortcut keeps working and the aria label stays.
2. Live status pill in the header, with a breathing dot. It opens a keyboard-accessible panel showing the build
   time, commit, page weight and Lighthouse scores. Only real values: read git and the m4 numbers at build time.
3. Interactive pipeline on home: on hover or focus, light the node's path. Cloud nodes link to
   /work/multi-cloud-terraform and ArgoCD links to /work/gitops-secrets. Every node must be a real link that
   can be reached with the keyboard.
4. Spotlight is pulled toward and brightens over the hovered or focused button or card (pointer devices only).
5. Light-sweep beam on View Transition page changes.
6. Cape Town time ambience: the light hue and intensity follow Africa/Johannesburg time. A footer clock
   "Cape Town HH:MM".
7. Numbers decode in on scroll. Use aria-hidden on the scramble so screen readers get the final text.
8. Build info footer: `build <short hash> · <YYYY-MM-DD>` read from git at build time.
9. /recruiter page:
   - a "For recruiters" pill in the header (in the mobile menu too) and a button in the home hero;
   - the content listed in DESIGN-BRIEF section 7;
   - calm, with minimal motion;
   - a print stylesheet so it prints as 1 page;
   - add it to the sitemap and the Ctrl+K palette, and give it an OG card.
   Roles, work setup and availability: use Luke's answer to Q-18 if it's in docs/content/answers.md. Otherwise
   use TODO(Luke) placeholders. Never invent them.
All motion must be off under prefers-reduced-motion and ?reduced=1. Contrast must stay at AA or better, so run
site/tools/contrast.mjs. Never write [gaming handle: see .private/forbidden-words.txt]. No phone number. No deploys or remotes. Commit locally.

Verify: `npm run build` and astro check are clean. Run the dev server on :4321 and stop it afterwards. Take
screenshots at 1280 and 390 of home, /recruiter, the status panel open, the pipeline hover and the footer, plus
a /recruiter print preview, and save them to docs/screens/m6/. The console must be clean. Check that focus is
visible on the new controls. Check the ?reduced=1 run. Run the a11y and contrast tools again.
Report: the changed files, the screenshots, what was verified and what wasn't, and any choices Luke may want a say in.

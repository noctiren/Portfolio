# CLAUDE.md: Portfolio

Luke Petzer's personal portfolio website. Read this first, then `MANAGER.md` (managers) and `docs/`.

## Goal
A clean, fast, professional portfolio that presents Luke as a **DevOps / Platform Engineer with a backend
(Java/Kotlin/Spring) background**. Audience: recruiters and hiring engineers, including for roles that involve AI. Luke wants it **bold and
distinctive** (dark, "shadow and blue light" mood, noticeable motion; see `docs/DESIGN-BRIEF.md`), but it has to
stay readable, fast and good on phones. It must not look like a generic dev-portfolio template.

## Owner
- Luke Petzer, Cape Town. Strong in backend (Java/Kotlin, Spring, .NET Core) and DevOps (Terraform,
  Kubernetes, ArgoCD, multi-cloud). **Not a frontend developer**, so explain frontend choices in plain terms
  and give a recommendation; don't just list options.
- Source of truth for career content: `docs/content/cv.md` (taken from his CV, 2026-11-15).
- Luke wants to be **asked about style** (colours, animations, look, extra sections), each time with a
  recommendation.

## Hard rules
- HR-LOCAL: Local only. **No deploying, publishing, pushing to a remote, or creating hosting/DNS/cloud
  resources** until Luke says "ready to host".
  Exception (Luke, 2026-11-15): the code may be pushed to the public repo `git@github.com:noctiren/Portfolio.git`
  (SSH, signed commits). Deploying/hosting is still not allowed. Never commit `.private/` or the CV PDF; never write
  the gaming handle listed in `.private/forbidden-words.txt` anywhere tracked (the repo is public).
  Local-only (git-ignored, never committed): `docs/content/cv.md`, `docs/content/answers.md`, `docs/content/ai.md`,
  `docs/QUESTIONS-FOR-LUKE.md`. They are still the HR-FACTS sources; read them locally, but never copy raw personal
  notes from them into tracked files.
- HR-INSTALL: Installing npm packages that are listed in `docs/DECISIONS.md` (the approved stack) is allowed.
  Any new dependency, global tool or other download needs Luke's OK first.
- HR-FACTS: No invented claims about Luke. Every job, number, skill or project on the site has to come from
  `docs/content/cv.md` or from Luke directly. If a placeholder is needed, mark it `TODO(Luke)`.
- HR-PRIVACY: Leave his phone number and street address off the site. Email and LinkedIn are fine.
- HR-A11Y: Meet WCAG AA contrast, support keyboard navigation, and respect `prefers-reduced-motion` for every
  animation.

## Layout (planned)
- `site/`: the website (frontend).
- `docs/`: brief, decisions, status, content.
- No backend is planned. See `docs/DECISIONS.md` D-002.

## How to verify a change
Run the dev server, open the page in opcode's side browser, and screenshot it at desktop (1280px) and mobile
(390px) widths. Check that there are no console errors and that keyboard focus is visible. State in the
report what was and wasn't checked.

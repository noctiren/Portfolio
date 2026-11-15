# Luke Petzer: portfolio

The personal portfolio of Luke Petzer, a DevOps / Platform Engineer with a backend (Java/Kotlin, Spring) background,
based in Cape Town.

The look is called **"Shadow & Light"**: a dark page where a blue spotlight follows the cursor and reveals an
infrastructure grid. It has huge condensed titles and long shadows, and the motion is noticeable but stops
completely for visitors who ask for reduced motion.

> Status: built and tested locally. Not hosted yet.

## Stack

- **[Astro](https://astro.build)**: a static site, with TypeScript and almost no JavaScript sent to the browser.
- **Plain CSS with design tokens** (`site/src/styles/tokens.css`). No CSS framework.
- **Self-hosted variable fonts**: Archivo (condensed display), Inter (body) and JetBrains Mono.
- **Astro content collections**: the case studies are Markdown files in `site/src/content/work/`.
- **View Transitions**: the header and the spotlight carry over between pages, so the site feels like one space.
- **A hand-written command palette** (Ctrl/Cmd+K), a `/recruiter` one-page profile that prints on one A4 page,
  and a footer that shows the build's commit hash and date.

The pages are home, `/work` plus one page per case study, `/experience`, `/ai`, `/about`, `/built` (how the
site is built), `/contact`, `/recruiter` and a custom 404.

## Run it locally

```sh
cd site
npm install
npm run dev      # http://127.0.0.1:4321
npm run build    # astro check + static build into site/dist
```

Add `?reduced=1` to any URL to force reduced motion.

## Quality bar

Each milestone was checked with scripts in `site/tools/`. They drive headless Edge (and Firefox) through the
Chrome DevTools Protocol, and their results are saved in `docs/screens/`:

- **Contrast:** every text element on every page state, measured against WCAG AA. Nothing falls below AA, and
  the lowest ratio is 5.95:1.
- **Accessibility:** keyboard Tab order, visible focus, labels and target sizes.
- **Page weight:** per route, raw and gzipped.
- **Lighthouse:** on mobile and desktop.
- **Screenshots:** every page at 1280px and 390px.

## How this was built with AI agents

The site was built by AI coding agents (Claude Code), coordinated by
Luke's extended version of [opcode](https://github.com/winfunc/opcode) (an open-source desktop app for Claude Code). One *manager* chat plans the work and starts
a *worker* chat for each task. Luke makes the style and content decisions, and every fact on the site comes from
him. The project files show the whole process, so you can follow it in this order:

| File | What it is |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | Hard rules every agent follows: privacy, no invented facts, accessibility, no deploys without a go-ahead. |
| [`MANAGER.md`](MANAGER.md) | What the manager may decide on its own and what must go to Luke, plus how worker reports are checked. |
| [`docs/DESIGN-BRIEF.md`](docs/DESIGN-BRIEF.md) | The design direction: rejected rounds, the chosen look, and the "alive" touches Luke picked. |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Each decision, with the reason for it and who made it. |
| [`docs/briefs/`](docs/briefs/) | The exact brief each worker received. |
| [`docs/screens/`](docs/screens/) | The evidence each worker had to provide: screenshots, audit output, notes. |
| [`docs/BOARD.md`](docs/BOARD.md), [`docs/open-checks.md`](docs/open-checks.md), [`WAITING.md`](WAITING.md), [`GUESSES.md`](GUESSES.md) | The tracker: done work, open checks, what waits on Luke, and assumptions not yet confirmed. |

The guardrails are the same ones you'd put on any shared platform:

- **Least privilege:** workers can't publish, deploy or install anything that isn't on the approved list.
- **No guessing:** facts and style choices go to the owner as questions.
- **Locks:** an agent claims files before editing, so two agents never change the same file at once.
- **Evidence:** nothing counts as done without screenshots and audit output.

The case study on the site has more detail: `/work/opcode`.

Some source notes, such as the raw CV transcription and Luke's answers, are kept out of this repo on purpose.

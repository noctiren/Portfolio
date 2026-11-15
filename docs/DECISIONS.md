# Decisions

Format: ID: decision. Why. Status (PROPOSED = waiting for Luke, DECIDED = settled).

- D-001: **Stack: Astro (static site) + plain CSS with design tokens (CSS custom properties) + TypeScript.**
  Why: Astro ships almost no JavaScript, so the site is very fast and scores well on Lighthouse. Content can
  live in Markdown files Luke can edit like docs. Components are simple HTML-like files, easy for a backend
  dev to read. No Tailwind: it would mean one more thing to learn. DECIDED (frontend manager, AA-DECIDE, 2026-11-15).
  Approved packages: `astro`, `@astrojs/check`, `typescript`, `@astrojs/sitemap`, `@fontsource-variable/*`
  for the chosen fonts (self-hosted, so no Google Fonts request).
  **Fonts chosen (W-M1, 2026-11-15):** display = **Archivo** (variable width axis, used condensed at 68%
  width / weight 800, replacing the mockup's Windows-only Bahnschrift); body = **Inter**; mono = **JetBrains Mono**.
  Installed: astro 7.4, @astrojs/sitemap, @astrojs/check, typescript, @fontsource-variable/{archivo,inter,jetbrains-mono}.
  Luke can veto the display font. Alternative: Oswald (narrower, more poster-like).
- D-002: **No backend for now.** Why: a portfolio is static content. The contact section uses
  `mailto:` + LinkedIn. If a contact form is wanted later, a hosted form endpoint or a small serverless
  function is cheaper than running a backend. DECIDED (frontend manager, 2026-11-15). Reopen if Luke wants a
  live feature (e.g. a status page or blog API).
- D-003: **Hosting (later): Cloudflare Pages, provisioned with Terraform, deployed by GitHub Actions.**
  Why: free, fast, and the setup itself shows Luke's DevOps skills (can be linked from the site as "how this site
  is built"). DECIDED (Luke, 2026-11-15, M5): address `lukepetzer.pages.dev` (free subdomain), Terraform with
  state in HCP Terraform (free tier), everything run by GitHub Actions so nothing is installed on Luke's PC.
  Files: `infra/main.tf` (one `cloudflare_pages_project`, Direct Upload), `.github/workflows/site.yml`
  (check + build, terraform plan/apply, `wrangler pages deploy` via cloudflare/wrangler-action; PRs only plan).
  `site/public/_headers` sets basic security headers and long caching for `/_astro/*`.
- D-004: **Look: "Shadow & Light"** (mockup `mockups/round2/r2-a-shadowlight.html` is the visual reference).
  The other mockups were scrapped (recoverable in git commit e73b9b5). DECIDED (Luke, 2026-11-15).
- D-005: **Multi-page site** (Luke 2026-11-15: "each page tab should be its own unique page"). Routes: `/` home,
  `/work` + `/work/<slug>` case studies, `/experience` (timeline + skills + education/cert), `/ai`, `/about`,
  `/built` (how this site is built), `/contact`, custom `404`. DECIDED (Luke + frontend manager).
- D-006: **Sticky header keeps Luke's name visible** while scrolling (Luke 2026-11-15). DECIDED.
- D-007: **Improvements added by the frontend manager** (Luke asked for "any other overall improvements"; he can
  veto any of them): (1) Astro View Transitions, so the spotlight and header carry over between pages and the
  site feels like one continuous dark space; (2) each page opens with its own giant lit title (WORK, EXPERIENCE,
  AI…); (3) a scroll-progress line in the header; (4) a Ctrl/Cmd+K command palette for jumping between pages
  (hand-written, no package); (5) on touch screens, the light follows taps and scrolling; (6) a "lost in the
  dark" 404 page; (7) self-hosted fonts instead of Windows-only Bahnschrift; (8) a skip link, glowing focus
  rings and reduced-motion support everywhere; (9) per-page SEO/Open Graph data and a sitemap. DECIDED (AA-DECIDE).
- D-008: **Lighthouse approved as a dev-only package** (`lighthouse` as a devDependency in site/, run locally against
  the local site with the installed Edge). Never shipped. DECIDED (Luke, inbox card c17947423323043d06173e, 2026-11-15).
- D-009: **M6 "alive" touches + /recruiter page** (Luke 2026-11-15, picked from the manager's options). Spec:
  `docs/DESIGN-BRIEF.md` section 7. New route `/recruiter` added to D-005. The build hash, date and site stats are
  read at build time (git + docs/screens/m4); no new packages. Everything switches off under reduced motion.
  M6 starts once M3 is done, because both touch the same pages. DECIDED (Luke).
- D-010: **Public GitHub repo `noctiren/Portfolio`, pushed over SSH with SSH-signed commits** (Luke 2026-11-15).
  Before the first push, history was rewritten: the author is "Luke Petzer <lukepetzerint2@gmail.com>", the CV PDF
  (which has his phone number) is removed from every commit, and the gaming handle is replaced in the docs. Backup:
  `../Portfolio-backup-20261115-1712.git`. The settings are repo-local (the global git identity is unchanged): key
  `~/.ssh/id_ed25519_noctiren` (no passphrase, this PC only, Luke's choice), `gpg.format=ssh`, `commit.gpgsign=true`,
  `core.sshCommand` pinned to that key. Hosting (D-003) is still Luke's call. DECIDED (Luke).
  Follow-up (Luke 2026-11-15, "keep workflow, hide personal"): cv.md, answers.md, ai.md and QUESTIONS-FOR-LUKE.md
  are removed from all history and git-ignored (still local). Force-pushed once; backup `../Portfolio-backup-20261115-1720.git`.

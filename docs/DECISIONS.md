# Decisions

Format: ID: decision. Why. Status (PROPOSED = waiting for Luke, DECIDED = settled).

- D-001: **Stack: Astro (static site) + plain CSS with design tokens (CSS custom properties) + TypeScript.**
  Why: Astro ships almost no JavaScript, so the site is very fast and scores well on Lighthouse. Content can
  live in Markdown files Luke can edit like docs. Components are simple HTML-like files, easy for a backend
  dev to read. No Tailwind: it would mean one more thing to learn. DECIDED (frontend manager, AA-DECIDE, 2026-11-15).
  Approved packages: `astro`, `@astrojs/check`, `typescript`, `@astrojs/sitemap`, `@fontsource-variable/*`
  for the chosen fonts (self-hosted, so no Google Fonts request).
- D-002: **No backend for now.** Why: a portfolio is static content. The contact section uses
  `mailto:` + LinkedIn. If a contact form is wanted later, a hosted form endpoint or a small serverless
  function is cheaper than running a backend. DECIDED (frontend manager, 2026-11-15). Reopen if Luke wants a
  live feature (e.g. a status page or blog API).
- D-003: **Hosting (later): Cloudflare Pages, provisioned with Terraform, deployed by GitHub Actions.**
  Why: free, fast, and the setup itself shows Luke's DevOps skills (can be linked from the site as "how this site
  is built"). PROPOSED (Luke decides at "ready to host", HR-LOCAL).
- D-004: Visual direction: see `docs/DESIGN-BRIEF.md`. PROPOSED (waiting for Luke, OW-STYLE).

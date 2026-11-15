# Worker brief: W-M1 Astro scaffold (task_kind: build)

Held 2026-11-15 because a worker account was unavailable. Start it with mcp__opcode__start_worker using this text as `task`.

Goal (M1): turn the chosen "Shadow & Light" mockup into the real Astro site in site/: base layout, persistent shell,
the full home page, every other route stubbed with its lit title (content pages are M2).

Read first: CLAUDE.md, docs/DECISIONS.md (D-001 stack/approved packages, D-004 to D-007 = spec), docs/DESIGN-BRIEF.md,
docs/content/cv.md, docs/content/ai.md. Visual reference: mockups/round2/r2-a-shadowlight.html.

Build:
1. Scaffold Astro + TS. Approved packages only (astro, @astrojs/check, typescript, @astrojs/sitemap,
   @fontsource-variable/*). Pick condensed display + body + mono fonts and log them in D-001. Lock site/package.json.
2. tokens.css (colours, type, spacing, shadows, motion).
3. Sticky header with the "LUKE PETZER" wordmark always visible (morphs in on home after the hero name scrolls away);
   nav Work/Experience/AI/About/Contact with the active state; scroll-progress line; mobile menu; footer (email,
   LinkedIn, GitHub TODO(Luke), CV PDF from docs/content to public/, link to /built); skip link.
4. Spotlight + infra grid as a persistent layer (View Transitions, transition:persist); touch = follows taps/scroll;
   off under prefers-reduced-motion.
5. Home: hero, pipeline diagram (top to bottom on phones), impact numbers, 3 teaser tiles (Work/Experience/AI),
   contact CTA.
6. Stubs with giant lit titles: /work, /work/[multi-cloud-terraform|gitops-secrets|identity-verification|
   zero-downtime-migration], /experience, /ai, /about, /built, /contact, 404 "lost in the dark".
7. Ctrl/Cmd+K command palette (hand-written, accessible).
8. Per-page meta/OG + sitemap.
Facts from cv.md/ai.md only; no phone; never [gaming handle: see .private/forbidden-words.txt]; no deploys or remotes; commit locally.

Verify: npm run build + astro check clean; dev server :4321 (stop it after); side-browser screenshots of home at
1280/390 + 2 stubs; header and light persist across navigation; active nav correct; focus visible on Tab; palette
opens/closes; ?reduced=1 override works.
Report: files/packages, screenshots, verified vs not, choices Luke may want a say on.

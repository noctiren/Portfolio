# Status

## 2026-11-15
- Done: project docs set up (CLAUDE.md, MANAGER.md rewrite, docs/ brief, decisions, CV content). git initialised.
- Done: motion, extras and .NET Core picked (see DESIGN-BRIEF). 3 look mockups built in `mockups/` (served at http://127.0.0.1:8765/ by worker W-style mockups).
- Round 1 looks rejected (too generic). Round 2 built in `mockups/round2/` (Shadow & Light, Blue Hour, Signal); Luke picking via inbox card. Unverified on mockups: console, keyboard, live mouse effects. Condensed font is Windows-only in mockups (the real build self-hosts its fonts).
- Added AI section (draft: `docs/content/ai.md`).
- Waiting on Luke: confirm the AI content + whether opcode can be shown, GitHub username for the portfolio, photo yes/no.
- Mockup notes for the real build: make the hero diagram flow top to bottom on phones; the console, reduced-motion and keyboard checks weren't done on the mockups.
- PAUSED 2026-11-15 ~11:30: plan budget line reached (5h 91%). No workers until usage resets.
  Worker W-style mockups (session 0342fc7d) is idle; its Python server on :8765 runs up to 2h, then stops.
  To view mockups after that: `cd mockups && python -m http.server 8765 --bind 127.0.0.1`.
- DONE: Luke picked Shadow & Light (D-004); other mockups scrapped (git e73b9b5 has them). Multi-page + sticky name + manager improvements decided (D-005 to D-007).
- DONE: M1 (commit 65a2fa4), reviewed by the manager (screenshots in docs/screens/m1). M1 dev server stopped (Luke approved).
- M2 committed (22fb6c2), manager review found: /experience title breaks mid-word on phones, mixed voice, long experience page. Fixes done (commit 214cb0d), preview running on 127.0.0.1:4321 (W-M2 task, PID 55192) for Luke to test.
- M1 + M2 CLOSED: Luke tested the whole site, Tested OK (2026-11-15). Next: M4 polish (no Luke input needed); M3 waits on Luke's answers (WAITING.md). Open questions collected in docs/QUESTIONS-FOR-LUKE.md.
- Next (frontend manager): once the style is picked, record the pick in DESIGN-BRIEF + DECISIONS D-004, then start worker 1 "Scaffold Astro site + design tokens + base
  layout" in `site/` (port the chosen mockup's tokens/effects; self-hosted condensed font to replace Bahnschrift). Then the hero and sections, then case-study pages, then a polish/a11y/Lighthouse pass.
- Milestones: M1 scaffold + tokens · M2 single page with all sections · M3 case-study pages · M4 polish
  (dark mode, motion, SEO, a11y) · M5 hosting (only after Luke says "ready to host").

## Blockers before hosting (M5)
- HR-PRIVACY: `site/public/Luke_Petzer_CV.pdf` is Luke's full CV and includes his phone number. Luke must supply a
  phone-free version (or explicitly OK the phone in the downloadable CV) before anything is hosted.
- M4 committed (e0add82), manager-checked: OG cards + favicon, contrast min 5.95:1 (CHK-5 closed), Firefox = Edge, a11y pass clean, home JS+CSS 53.7 KB. Lighthouse (CHK-4) blocked by a Claude Code permission; Luke card c17947440848111908f35d.
- M4 CLOSED (468ed96). Lighthouse: perf 97-100, a11y 100, SEO 100, BP 81 (only from security software injecting http scripts on this PC). Next: M3 needs Luke's answers (WAITING.md); M5 hosting needs B-1/B-2 + "ready to host". Nothing running.

## 2026-11-15 (later): M3 + M6 done
- M3 content v2 accepted (e80b983). Luke approved the opcode wording (Q-19).
- M6 alive touches + /recruiter accepted (f72427d); Q-18 facts are used. Luke's test card T-2 is open, and the dev server on :4321 was started by W-M6 and is left running for the test.
- Next: Luke's T-2 result -> fixes via W-M6 if needed, then stop the :4321 server. Re-run Lighthouse after M6.
- Waiting on Luke: T-2 test, CHK-1 phone, CHK-3 screen reader, optional Q-17, M5 "ready to host".
- 2026-11-15: History scrubbed and signed for the public repo noctiren/Portfolio (D-010).
- 2026-11-15: Luke tested M6 OK (T-2). M6 is closed. Open: CHK-1/2/3, CHK-8 Lighthouse re-run, M5 when Luke says "ready to host".

## 2026-11-15 (evening): M5 hosting
- Luke: "ready to host". Picks: lukepetzer.pages.dev, Terraform + HCP state, existing Cloudflare account (D-003 DECIDED).
- Written: `infra/main.tf`, `.github/workflows/site.yml`, `site/public/_headers`; site URL set in astro.config + robots.txt;
  /built now says "Live" (screens in docs/screens/m5/). Local build + astro check clean.
- Waiting on Luke: M5-SETUP (Cloudflare token, HCP org/workspace/token, GitHub secrets + variable). The first push
  will fail at the infra step until those exist; re-run the workflow after.
- Next (manager): after the first green deploy, check the live site, then CHK-8 Lighthouse against HTTPS.
- LIVE 2026-11-15: Luke set up the accounts; the workflow is green and https://lukepetzer.pages.dev serves every page,
  the 404 and the security headers. Lighthouse on HTTPS (CHK-8): BP now 100. Fix found: internal links like /built got a
  308 to /built/ on every click, so the pages are now built as files (`build.format: 'file'`, `src/data/path.ts` keeps
  canonical/OG/nav paths clean).
- Open: CHK-1 phone, CHK-2 Safari, CHK-3 screen reader (Luke); optional Q-17.
- 2026-11-16: Luke: Edge test scripts left dozens of windows in Alt-Tab. `site/tools/cdp.mjs` now runs Edge as
  `--headless=new` off-screen, closes every page then the browser, kills the whole process tree (taskkill /T), and
  also kills it on crash/Ctrl+C; xbrowser.mjs does the same for Firefox. `routes()` fixed for the file-format build
  (it only found / and /404). NOT run yet: Node.js is missing from this PC (C:\Program Files\nodejs is gone), so the
  changes are uncommitted until Node is back and a test run shows no leftover windows.

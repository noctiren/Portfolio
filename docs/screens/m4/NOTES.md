# M4 polish + audits: evidence (W-M4, 2026-11-15)

All measured on the built site (`npm run build`, served by `astro preview` on 127.0.0.1:4321). The scripts live
in `site/tools/` and use no packages: Node's built-in WebSocket talks to headless Edge (Chrome DevTools Protocol)
and to headless Firefox (WebDriver BiDi). Re-run any of them with `node tools/<name>.mjs` from `site/`.

| File | What | Script |
|---|---|---|
| `contrast.txt` | CHK-5: contrast of every visible text element, 12 pages x 2 widths + open palette + open menu | `tools/contrast.mjs` |
| `a11y.txt` | h1/headings/landmarks/alt/names/ids/targets per page; Tab-through focus check; palette + menu keyboard tests | `tools/a11y.mjs` |
| `weight.txt` | per-page HTML/CSS/JS/font bytes (raw + gzip) | `tools/weight.mjs` |
| `xbrowser/` | CHK-2: Edge vs Firefox full-page shots (`edge-*`, `firefox-*`), side-by-sides (`side-*`), `run.txt`, `diff.txt` | `tools/xbrowser.mjs` |
| `print-experience.pdf` | print stylesheet output for /experience (Edge "Save as PDF") | - |
| `*.png` | verification shots: home 1280/390, menu open 390, "Full details" 390, focus ring on skip link and contact row | - |
| `site/public/og/*.png` | link-preview cards (1200x630), one per page; `site/public/apple-touch-icon.png` | `tools/og/make-og.mjs` |

## CHK-2 Firefox vs Edge (Firefox 1xx headless via WebDriver BiDi, Edge headless via CDP)
Same viewport in both (1280x900 and 390x844), `?reduced=1` so the light is still and every reveal is shown.
- Page heights match to within 2px on all 8 page/width pairs (`run.txt`), so the layout is the same: same
  line breaks, same title fit, same grid, same wrapping of tags and buttons.
- 0.8 to 5.8% of pixels differ by more than 40/255 (`diff.txt`). Looking at the side-by-sides, that is text
  anti-aliasing and the soft spotlight/grid mask (Firefox draws the lit grid a little brighter). The biggest number,
  /experience at 390, is a 2px vertical drift on a very long page.
- No console errors in either browser.
- Nothing needed fixing for Firefox.
- **Safari was not tested** (no macOS/iOS here). Risky spots for Safari: `backdrop-filter` (prefixed, already done),
  `-webkit-text-stroke` (fine), View Transitions (Safari 18+, falls back to a normal page load), `:has()` (Safari 15.4+).

## CHK-7 Permissions-Policy console warnings: not from the site
The browser receives `permissions-policy: browsing-topics=(), join-ad-interest-group=(), ... run-ad-auction=()` on
every page, but `curl -I http://127.0.0.1:4321/` shows the server sends no such header, and no page contains one.
The resource list also shows scripts injected from `addon-1.local` and `addon-2.local`: add-on on this PC
adds the header (its "block ad tracking" option). On a real host the warning won't appear.

## Performance
Home page JS+CSS = 53.7 KB raw / 17.6 KB gzipped (target < 150 KB). Fonts: 3 woff2 files, 174.6 KB, only the Latin
subsets load (the other subsets are skipped via unicode-range). The Archivo + Inter files are now preloaded. All JS is
`type="module"` (deferred, not render-blocking); the one inline head script is the reduced-motion switch, which must
run before first paint. The site has no `<img>`, so there is nothing to lazy-load.
Possible further win (needs Luke's OK, new tool): cut Archivo (90 KB, all widths and weights) down to the one
width and weight used, about 25 KB, with `fonttools`, which isn't installed.

## Not checked here
Real phone (CHK-1), screen reader (CHK-3), Safari (part of CHK-2). Lighthouse (CHK-4) was run later: see `lighthouse/README.md`.

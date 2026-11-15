# CHK-4 Lighthouse (2026-11-15)

Lighthouse 13 (devDependency, D-008), headless Edge, mobile + desktop presets, on the built site.
Run: `node tools/serve.mjs 4322` then `BASE=http://127.0.0.1:4322 node tools/lh.mjs <tag>` (from `site/`).
`tools/serve.mjs` is a small static server with gzip and cache headers like a real host (no packages).
`astro preview` could not be used: another preview process already held the project.

## Final scores (`site-*`, local browser add-ons requests blocked)
| page | mobile perf / a11y / best / SEO | desktop perf / a11y / best / SEO |
|---|---|---|
| home | 97 / 100 / 81 / 100 | 100 / 100 / 81 / 100 |
| /work | 99 / 100 / 81 / 100 | 100 / 100 / 81 / 100 |
| /work/gitops-secrets | 99 / 100 / 81 / 100 | 100 / 100 / 81 / 100 |
| /experience | 97 / 100 / 81 / 100 | 100 / 100 / 81 / 100 |

Mobile: FCP 1.5 s, LCP 2.0 to 2.6 s, TBT 0 ms, CLS 0, Speed Index 1.5 s.

## What the remaining flags are
- **Best practices 81:** the only failing audit is `is-on-https`. In every `site-*` report it lists the same 3 URLs:
  `addon-2.local` and `addon-1.local` (x2), the http:// requests local browser add-ons inject
  on this PC (blocked, but still counted). None of the site's own requests are listed: Lighthouse treats
  127.0.0.1 as secure. On HTTPS hosting (Cloudflare Pages) without those injections this audit passes.
- **Mobile LCP 2.6 s on home and /experience** (just over the 2.5 s "good" line). This is Lighthouse's simulated slow
  4G (the measured LCP in the same run was 1.4 s on this PC). The wait is the 90 KB Archivo font plus the fade-in. The real fix
  is a smaller Archivo file (only the one width and weight used, about 25 KB), which needs `fonttools`: Luke's call.
- `unused-css-rules` (~16 KB): rules for other pages in the shared stylesheet. Too small to be worth splitting.

## With the local browser add-ons injections (`injected-*`, first run)
Mobile perf 38, desktop 71: about 2 MB of scripts that local browser add-ons inject (render-blocking, unminified,
unused). That is this PC, not the site. Only the summary and the home reports are kept.

## Tried and reverted (no clear gain on a fair re-run)
1. Start the on-screen reveals from an inline script + CSS animation instead of waiting for the JS bundle.
2. Put the CSS inside each page (`build.inlineStylesheets: 'always'`).
On the gzip server, before vs after: home and /experience stayed at LCP 2.6 s, /work went 2.0 to 1.5 s,
and /work/gitops-secrets went 2.0 to 2.6 s. That is no net win, and it costs CSS caching, so the M4 code stays as it was.

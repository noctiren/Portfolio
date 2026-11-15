// Page weight: what each built page really downloads in headless Edge (Network events via CDP), split by type,
// with gzip sizes (what a host like Cloudflare Pages would send) computed from dist/. Needs the site served on BASE.
//   node tools/weight.mjs [out-file]
import { readFileSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, resolve } from 'node:path';
import { launch, routes, BASE } from './cdp.mjs';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const outFile = process.argv[2] ?? resolve(root, '../docs/screens/m4/weight.txt');
const kb = (n) => (n / 1024).toFixed(1).padStart(6);

const b = await launch(9338);
// resource URLs come from the Performance API; sizes are read from dist/ (exact, and gzip is computed locally)
const lines = [];
const fontsSeen = new Set();
let home;
lines.push('page                              HTML raw/gz      CSS raw/gz       JS raw/gz    fonts(woff2)   requests');
for (const r of routes(dist)) {
  await b.goto(`${BASE}${r}`, 1280);
  await new Promise((res) => setTimeout(res, 800));
  // scroll to the bottom so anything lazy would load too
  await b.evaluate(() => new Promise((res) => { scrollTo(0, document.documentElement.scrollHeight); setTimeout(res, 600); }));
  const entries = await b.evaluate(() => performance.getEntriesByType('resource').map((e) => ({ url: e.name, type: e.initiatorType })).concat([{ url: location.href, type: 'document' }]));
  const sum = { html: [0, 0], css: [0, 0], js: [0, 0], font: 0, n: 0 };
  for (const e of entries) {
    const u = new URL(e.url);
    if (u.origin !== new URL(BASE).origin) { sum.ext = (sum.ext ?? 0) + 1; continue; }
    sum.n++;
    let file = join(dist, decodeURIComponent(u.pathname));
    if (e.type === 'document') file = r === '/404' ? join(dist, '404.html') : join(dist, u.pathname, 'index.html');
    let buf;
    try { buf = readFileSync(file); } catch { continue; }
    const pair = [buf.length, gzipSync(buf, { level: 9 }).length];
    if (e.type === 'document') sum.html = pair;
    else if (/\.css$/.test(u.pathname)) { sum.css[0] += pair[0]; sum.css[1] += pair[1]; }
    else if (/\.js$/.test(u.pathname)) { sum.js[0] += pair[0]; sum.js[1] += pair[1]; }
    else if (/\.woff2$/.test(u.pathname)) { sum.font += buf.length; fontsSeen.add(u.pathname.split('/').pop()); }
  }
  if (r === '/') home = sum;
  lines.push(`${r.padEnd(32)} ${kb(sum.html[0])}/${kb(sum.html[1])}  ${kb(sum.css[0])}/${kb(sum.css[1])}  ${kb(sum.js[0])}/${kb(sum.js[1])}  ${kb(sum.font)}        ${sum.n}${sum.ext ? ` (+${sum.ext} injected by local local browser add-ons, not counted)` : ''}`);
}
await b.close();
const homeJsCss = home.css[0] + home.js[0];
const homeJsCssGz = home.css[1] + home.js[1];
const report = [
  `Page weight, ${new Date().toISOString().slice(0, 16).replace('T', ' ')}, headless Edge at 1280px, ${BASE}, after scrolling to the bottom (tools/weight.mjs)`,
  'Sizes in KB. "raw" = file size in dist/; "gz" = gzip -9 of that file (what a host sends compressed). Fonts are already compressed (woff2).',
  'HTML includes the inline <style> blocks Astro writes into each page.',
  '',
  ...lines,
  '',
  `Home page JS+CSS (excluding fonts): ${(homeJsCss / 1024).toFixed(1)} KB raw, ${(homeJsCssGz / 1024).toFixed(1)} KB gzipped (target < 150 KB).`,
  `Font files actually downloaded across all pages: ${[...fontsSeen].sort().join(', ')}`,
].join('\n');
writeFileSync(outFile, report + '\n');
console.log(report);

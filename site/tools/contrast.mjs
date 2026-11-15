// CHK-5: measured WCAG contrast of every visible text element on every built page, at 1280 and 390 wide,
// plus the open palette and the open mobile menu. Needs the built site served (npm run build; npm run preview).
//   node tools/contrast.mjs [out-file]
// How the background is found: the element's ancestors are composited top-down from the page colour; every
// gradient stop counts as a possible background, and text that sits over the spotlight layer is also tested
// against the spotlight's brightest glow. The worst (lowest) ratio is reported. Opacity is applied to the text.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { launch, routes, BASE } from './cdp.mjs';

const root = resolve(import.meta.dirname, '..');
const outFile = process.argv[2] ?? resolve(root, '../docs/screens/m4/contrast.txt');

function measure(scope) {
  const parse = (s) => {
    const m = s && s.match(/rgba?\(([^)]+)\)/);
    if (!m) return s === 'transparent' || !s ? [0, 0, 0, 0] : null;
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return [p[0], p[1], p[2], p[3] ?? 1];
  };
  const over = (top, bot) => {
    const a = top[3];
    return [0, 1, 2].map((i) => top[i] * a + bot[i] * (1 - a)).concat(1);
  };
  const lum = (c) => {
    const [r, g, b] = c.slice(0, 3).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  const hex = (c) => '#' + c.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  const pageBg = parse(getComputedStyle(document.documentElement).backgroundColor);
  const glow = [76, 155, 255, 0.16];

  const name = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) return s + '#' + el.id;
    const cls = [...el.classList].filter((c) => !c.startsWith('astro')).slice(0, 2);
    if (cls.length) s += '.' + cls.join('.');
    const p = el.parentElement;
    return p && p !== document.body ? name(p).split(' ').slice(-1)[0] + ' > ' + s : s;
  };
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden') return false;
      if (cs.getPropertyValue('clip') === 'rect(0px, 0px, 0px, 0px)' || cs.clipPath === 'inset(50%)') return false;
    }
    return true;
  };

  const seen = new Set();
  const results = [];
  const walker = document.createTreeWalker(scope ? document.querySelector(scope) : document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement;
    if (!el || seen.has(el) || !n.textContent.trim() || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) continue;
    seen.add(el);
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    let fg = parse(cs.color);
    const stroke = parseFloat(cs.webkitTextStrokeWidth) > 0 ? parse(cs.webkitTextStrokeColor) : null;
    if (fg[3] === 0 && stroke) fg = stroke;
    // ancestors, top-down
    const chain = [];
    for (let e = el; e && e !== document.documentElement; e = e.parentElement) chain.unshift(e);
    const inShell = el.closest('header.site-header, dialog');
    let bgs = inShell ? [pageBg] : [pageBg, over(glow, pageBg)];
    let opacity = 1;
    for (const e of chain) {
      const s = getComputedStyle(e);
      opacity *= parseFloat(s.opacity);
      // an open modal <dialog> sits on its ::backdrop (rgba(2, 4, 8, 0.72)), not on the page below
      if (e.tagName === 'DIALOG' && e.open) bgs = [over([2, 4, 8, 0.72], pageBg)];
      const c = parse(s.backgroundColor);
      if (c && c[3] > 0) bgs = bgs.map((b) => over(c, b));
      const img = s.backgroundImage;
      if (img && img.includes('gradient')) {
        const stops = [...img.matchAll(/rgba?\([^)]+\)/g)].map((m) => parse(m[0]));
        if (stops.length) bgs = bgs.flatMap((b) => stops.map((st) => over(st, b)));
        bgs = [...new Map(bgs.map((b) => [hex(b), b])).values()];
      }
    }
    const textOn = (b) => over([fg[0], fg[1], fg[2], fg[3] * opacity], b);
    let worst = Infinity, worstBg = bgs[0];
    for (const b of bgs) { const r = ratio(textOn(b), b); if (r < worst) { worst = r; worstBg = b; } }
    const size = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10);
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const decorative = !!el.closest('[aria-hidden="true"]');
    results.push({ el: name(el), text: n.textContent.trim().replace(/\s+/g, ' ').slice(0, 40), fg: hex(fg) + (fg[3] < 1 ? `@${fg[3]}` : ''), bg: hex(worstBg), ratio: +worst.toFixed(2), size, large, need: large ? 3 : 4.5, decorative, opacity: +opacity.toFixed(2) });
  }
  // input placeholders
  (scope ? document.querySelector(scope) : document).querySelectorAll('input[placeholder]').forEach((i) => {
    if (!visible(i)) return;
    const fg = parse(getComputedStyle(i, '::placeholder').color);
    const b = over(parse(getComputedStyle(i.closest('dialog') ?? i).backgroundColor), pageBg);
    results.push({ el: name(i) + '::placeholder', text: i.placeholder, fg: hex(fg), bg: hex(b), ratio: +ratio(over(fg, b), b).toFixed(2), size: parseFloat(getComputedStyle(i).fontSize), large: false, need: 4.5, decorative: false, opacity: 1 });
  });
  return results;
}

const b = await launch();
const lines = [];
let fails = 0, checked = 0, lowest = { ratio: Infinity };
const states = [];
for (const r of routes(resolve(root, 'dist'))) for (const w of [1280, 390]) states.push({ r, w });
states.push({ r: '/', w: 1280, open: 'palette' }, { r: '/', w: 390, open: 'menu' });
for (const s of states) {
  await b.goto(`${BASE}${s.r}?reduced=1`, s.w);
  if (s.open === 'palette') await b.evaluate(() => document.querySelector('[data-palette-open]').click());
  if (s.open === 'menu') await b.evaluate(() => document.querySelector('[data-menu-btn]').click());
  if (s.open) await new Promise((r) => setTimeout(r, 300));
  const scope = { palette: '[data-palette]', menu: '[data-nav]' }[s.open];
  const res = await b.evaluate(measure, scope);
  const bad = res.filter((x) => !x.decorative && x.ratio < x.need);
  checked += res.length;
  fails += bad.length;
  for (const x of res) if (!x.decorative && x.ratio < lowest.ratio) lowest = { ...x, page: s.r, w: s.w };
  const min = Math.min(...res.filter((x) => !x.decorative).map((x) => x.ratio));
  lines.push(`${(s.r + (s.open ? ` [${s.open} open]` : '')).padEnd(38)} ${String(s.w).padStart(4)}px  ${String(res.length).padStart(4)} text elements  lowest ${min.toFixed(2)}:1  ${bad.length ? `FAIL x${bad.length}` : 'pass'}`);
  for (const x of bad) lines.push(`    FAIL ${x.ratio}:1 (needs ${x.need}) ${x.fg} on ${x.bg} ${x.size}px  ${x.el}  "${x.text}"${x.opacity < 1 ? ` opacity ${x.opacity}` : ''}`);
}
await b.close();

const report = [
  `Contrast audit (CHK-5), ${new Date().toISOString().slice(0, 16).replace('T', ' ')}, headless Edge, ${BASE}, reduced motion (all reveals shown)`,
  'Method: tools/contrast.mjs. Every visible text element (plus input placeholders); background = ancestors composited',
  'over the page colour, every gradient stop tried, and text outside the header/dialogs also tried over the brightest',
  'spotlight glow. Worst case reported. AA: 4.5:1 normal text, 3:1 large text (>=24px, or >=18.66px bold).',
  'Not measured: hover/focus colour changes, text over the thin lit topology lines, text-shadow (only helps here).',
  '',
  ...lines,
  '',
  `Total: ${checked} text elements checked across ${states.length} page states, ${fails} below AA.`,
  `Lowest non-decorative: ${lowest.ratio}:1 (${lowest.fg} on ${lowest.bg}, ${lowest.el} "${lowest.text}", ${lowest.page} @${lowest.w}px).`,
].join('\n');
writeFileSync(outFile, report + '\n');
console.log(report);

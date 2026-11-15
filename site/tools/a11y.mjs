// Accessibility DOM checks on every built page (headless Edge via CDP). Needs the built site served on BASE.
//   node tools/a11y.mjs [out-file]
// Per page: lang, exactly one h1, heading levels never skip, landmarks, image alt, accessible names for links and
// buttons, duplicate ids, touch-target size at 390px. Then real keyboard tests: Tab through the page checking that
// every focused element shows a visible focus style; Ctrl+K palette (dialog, focus inside, Esc closes, focus
// returns); mobile menu (aria-expanded, Esc closes, focus returns).
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { launch, routes, BASE } from './cdp.mjs';

const root = resolve(import.meta.dirname, '..');
const outFile = process.argv[2] ?? resolve(root, '../docs/screens/m4/a11y.txt');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function audit(width) {
  const out = { fails: [], notes: [] };
  const fail = (m) => out.fails.push(m);
  const note = (m) => out.notes.push(m);
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && !el.closest('[hidden], dialog:not([open])'); };
  const desc = (el) => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').filter((c) => !c.startsWith('astro'))[0] : ''} "${(el.textContent || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 30)}"`;
  const accName = (el) => {
    if (el.getAttribute('aria-label')) return el.getAttribute('aria-label').trim();
    const lb = el.getAttribute('aria-labelledby');
    if (lb) return lb.split(' ').map((id) => document.getElementById(id)?.textContent ?? '').join(' ').trim();
    const clone = el.cloneNode(true);
    clone.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
    clone.querySelectorAll('img[alt]').forEach((n) => n.replaceWith(n.alt));
    return clone.textContent.trim();
  };

  if (!document.documentElement.lang) fail('<html> has no lang');
  const h1s = document.querySelectorAll('h1');
  if (h1s.length !== 1) fail(`${h1s.length} h1 elements`);
  let prev = 0;
  document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    const lv = +h.tagName[1];
    if (prev && lv > prev + 1) fail(`heading skips h${prev} -> h${lv}: ${desc(h)}`);
    prev = lv;
  });
  const lm = {
    banner: document.querySelectorAll('body > header, [role=banner]').length,
    nav: document.querySelectorAll('nav').length,
    main: document.querySelectorAll('main').length,
    contentinfo: document.querySelectorAll('body > footer, [role=contentinfo]').length,
  };
  if (lm.banner !== 1 || lm.main !== 1 || lm.contentinfo !== 1 || lm.nav < 1) fail(`landmarks ${JSON.stringify(lm)}`);
  const navs = [...document.querySelectorAll('nav')];
  if (navs.length > 1 && navs.some((n) => !n.getAttribute('aria-label'))) fail('several <nav> without aria-label');
  document.querySelectorAll('img').forEach((i) => { if (!i.hasAttribute('alt')) fail(`img without alt: ${i.src}`); });
  document.querySelectorAll('svg').forEach((s) => {
    if (s.getAttribute('aria-hidden') === 'true' || s.closest('[aria-hidden="true"]')) return;
    if (s.getAttribute('role') === 'img' && (s.getAttribute('aria-label') || s.querySelector('title'))) return;
    fail(`svg neither hidden nor labelled: ${desc(s)}`);
  });
  document.querySelectorAll('a[href], button, input, [role=option], [tabindex]:not([tabindex="-1"])').forEach((el) => {
    if (el.matches('input') && (el.labels?.length || el.getAttribute('aria-label'))) return;
    if (!accName(el)) fail(`no accessible name: ${desc(el)} ${el.outerHTML.slice(0, 80)}`);
  });
  const ids = {};
  document.querySelectorAll('[id]').forEach((e) => { ids[e.id] = (ids[e.id] ?? 0) + 1; });
  Object.entries(ids).filter(([, n]) => n > 1).forEach(([id]) => fail(`duplicate id "${id}"`));
  document.querySelectorAll('[aria-controls], [aria-labelledby], [aria-describedby]').forEach((el) => {
    for (const a of ['aria-controls', 'aria-labelledby', 'aria-describedby']) for (const id of (el.getAttribute(a) ?? '').split(' ').filter(Boolean)) if (!document.getElementById(id)) fail(`${a} -> missing #${id}`);
  });
  // target size (mobile width only). WCAG 2.2 AA (2.5.8) needs 24x24 unless the target is inline in text;
  // the brief asks for 44x44 on controls, so smaller non-inline controls are listed as notes.
  if (width < 600) {
    document.querySelectorAll('a[href], button, input, summary').forEach((el) => {
      if (!visible(el)) return;
      // a "stretched link" (absolute ::after over its positioned parent) is as big as that parent
      const af = getComputedStyle(el, '::after');
      const stretched = af.content !== 'none' && af.position === 'absolute' && el.offsetParent;
      const r0 = (stretched ? el.offsetParent : el).getBoundingClientRect();
      const r = { width: Math.round(r0.width), height: Math.round(r0.height) };
      const inline = getComputedStyle(el).display === 'inline' && el.closest('p, li, dd, td');
      if (inline) return;
      if (r.width < 24 || r.height < 24) fail(`target < 24px (${Math.round(r.width)}x${Math.round(r.height)}): ${desc(el)}`);
      else if (r.width < 44 || r.height < 44) note(`target < 44px (${Math.round(r.width)}x${Math.round(r.height)}): ${desc(el)}`);
    });
  }
  return out;
}

const b = await launch(9337);
const key = async (k, mods = 0) => {
  const code = { Tab: 'Tab', Escape: 'Escape', k: 'KeyK', Enter: 'Enter' }[k];
  const vk = { Tab: 9, Escape: 27, k: 75, Enter: 13 }[k];
  const text = k === 'Enter' ? String.fromCharCode(13) : undefined; // a keyDown with text is what activates a focused button
  await b.send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, windowsVirtualKeyCode: vk, modifiers: mods, text });
  await b.send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk, modifiers: mods });
  await sleep(60);
};
const focusInfo = () => b.evaluate(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const cs = getComputedStyle(el);
  // the ring may be drawn on a card/row around the link via :has(a:focus-visible): accept an outline up to 3 parents up
  let ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none';
  for (let p = el.parentElement, i = 0; !ring && p && i < 3; p = p.parentElement, i++) {
    const ps = getComputedStyle(p);
    if (ps.outlineStyle !== 'none' && parseFloat(ps.outlineWidth) > 0 && p.matches(':has(:focus-visible)')) ring = true;
  }
  const r = el.getBoundingClientRect();
  return { tag: el.tagName.toLowerCase(), text: (el.textContent || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 28), ring, focusVisible: el.matches(':focus-visible'), onScreen: r.bottom > 0 && r.top < innerHeight };
});

const lines = [];
let totalFails = 0;
for (const r of routes(resolve(root, 'dist'))) {
  for (const w of [1280, 390]) {
    await b.goto(`${BASE}${r}?reduced=1`, w);
    const res = await b.evaluate(audit, w);
    totalFails += res.fails.length;
    lines.push(`${r.padEnd(32)} ${String(w).padStart(4)}px  ${res.fails.length ? 'FAIL x' + res.fails.length : 'pass'}${res.notes.length ? `  (${res.notes.length} notes)` : ''}${b.problems.filter((p) => !p.includes('Permissions-Policy')).length ? '  console: ' + b.problems.join(' | ') : ''}`);
    res.fails.forEach((f) => lines.push('    FAIL ' + f));
    res.notes.forEach((n) => lines.push('    note ' + n));
  }
}

// keyboard: Tab through every page at 1280, each stop must show a focus ring
lines.push('', 'Keyboard: Tab through each page at 1280px (every stop must match :focus-visible, show an outline/box-shadow and be on screen)');
for (const r of routes(resolve(root, 'dist'))) {
  await b.goto(`${BASE}${r}?reduced=1`, 1280);
  const stops = [];
  for (let i = 0; i < 80; i++) {
    await key('Tab');
    const f = await focusInfo();
    if (!f) break;
    if (stops.length && stops[0].tag === f.tag && stops[0].text === f.text) break; // wrapped
    stops.push(f);
  }
  const bad = stops.filter((s) => !s.ring || !s.focusVisible || !s.onScreen);
  totalFails += bad.length;
  lines.push(`${r.padEnd(32)} ${String(stops.length).padStart(3)} tab stops, first: ${stops[0]?.text ?? '-'}  ${bad.length ? 'FAIL x' + bad.length : 'pass'}`);
  bad.forEach((s) => lines.push(`    FAIL ${s.tag} "${s.text}" ring=${s.ring} focus-visible=${s.focusVisible} on-screen=${s.onScreen}`));
}

// palette
lines.push('', 'Palette (Ctrl+K)');
await b.goto(`${BASE}/work?reduced=1`, 1280);
await key('Tab');
await key('Tab');
const opener = await focusInfo();
await key('k', 2);
await sleep(200);
const pal = await b.evaluate(() => {
  const d = document.querySelector('[data-palette]');
  return { open: d.open, modal: d.matches(':modal'), role: d.tagName === 'DIALOG' ? 'dialog (native)' : d.getAttribute('role'), label: d.getAttribute('aria-label'), focusInside: d.contains(document.activeElement), active: document.activeElement.id, activedescendant: document.activeElement.getAttribute('aria-activedescendant') };
});
let trapped = true;
for (let i = 0; i < 6; i++) { await key('Tab'); if (!(await b.evaluate(() => document.querySelector('[data-palette]').contains(document.activeElement) || document.activeElement === document.body))) trapped = false; }
await key('Escape');
await sleep(150);
const after = await b.evaluate(() => ({ open: document.querySelector('[data-palette]').open }));
const back = await focusInfo();
const palOk = pal.open && pal.modal && pal.focusInside && trapped && !after.open && back?.text === opener?.text;
if (!palOk) totalFails++;
lines.push(`  ${palOk ? 'pass' : 'FAIL'}: opens as ${pal.role} "${pal.label}", modal=${pal.modal}, focus in ${pal.active} (aria-activedescendant=${pal.activedescendant}), Tab stays inside=${trapped}, Esc closes=${!after.open}, focus back on "${back?.text}" (opener "${opener?.text}")`);

// mobile menu
lines.push('', 'Mobile menu (390px)');
await b.goto(`${BASE}/?reduced=1`, 390);
const menu0 = await b.evaluate(() => { const m = document.querySelector('[data-menu-btn]'); m.focus(); return m.getAttribute('aria-expanded'); });
await key('Enter');
await sleep(150);
const menu1 = await b.evaluate(() => ({ exp: document.querySelector('[data-menu-btn]').getAttribute('aria-expanded'), shown: getComputedStyle(document.querySelector('[data-nav]')).display !== 'none' }));
const firstLink = await focusInfo(); // focus should already be on the first menu link
await key('Tab');
const secondLink = await focusInfo();
await key('Escape');
await sleep(150);
const menu2 = await b.evaluate(() => ({ exp: document.querySelector('[data-menu-btn]').getAttribute('aria-expanded'), shown: getComputedStyle(document.querySelector('[data-nav]')).display !== 'none', focusOnBtn: document.activeElement.matches('[data-menu-btn]') }));
const menuOk = firstLink?.text === 'Work' && secondLink?.text === 'Experience' && menu0 === 'false' && menu1.exp === 'true' && menu1.shown && menu2.exp === 'false' && !menu2.shown && menu2.focusOnBtn;
if (!menuOk) totalFails++;
lines.push(`  ${menuOk ? 'pass' : 'FAIL'}: aria-expanded ${menu0} -> ${menu1.exp} (nav shown=${menu1.shown}), focus moves to "${firstLink?.text}", Tab -> "${secondLink?.text}", Esc -> ${menu2.exp} (hidden=${!menu2.shown}, focus back on button=${menu2.focusOnBtn})`);

await b.close();
const report = [`Accessibility DOM checks, ${new Date().toISOString().slice(0, 16).replace('T', ' ')}, headless Edge, ${BASE} (tools/a11y.mjs)`, '', ...lines, '', `Total failures: ${totalFails}`].join('\n');
writeFileSync(outFile, report + '\n');
console.log(report);

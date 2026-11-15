// M6 verification shots (headless Edge via tools/cdp.mjs, no packages). Needs the site served on BASE.
//   node tools/m6-shots.mjs [out-dir]     (default ../docs/screens/m6)
// Saves PNGs at 1280 and 390, a /recruiter print PDF + print-media PNG, and run.txt with console problems,
// focus checks and the ?reduced=1 checks.
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { launch, BASE } from './cdp.mjs';

const root = resolve(import.meta.dirname, '..');
const out = resolve(process.argv[2] ?? resolve(root, '../docs/screens/m6'));
mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = [];
const note = (s) => { log.push(s); console.log(s); };

const b = await launch(9341);

async function shot(name, full = false) {
  let clip;
  if (full) {
    const h = await b.evaluate(() => document.documentElement.scrollHeight);
    const w = await b.evaluate(() => innerWidth);
    clip = { x: 0, y: 0, width: w, height: h, scale: 1 };
  }
  const r = await b.send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip, captureBeyondViewport: true } : {}) });
  writeFileSync(join(out, name), Buffer.from(r.data, 'base64'));
  note(`  wrote ${name}`);
}
// Add-on hosts injected on the dev PC: git-ignored .private/addon-hosts.txt (one per line).
const addonHostsFile = new URL('../../.private/addon-hosts.txt', import.meta.url);
const addonHosts = existsSync(addonHostsFile) ? readFileSync(addonHostsFile, 'utf8').split(/\r?\n/).map((x) => x.trim()).filter(Boolean) : [];
const problems = (label) => {
  const p = b.problems.filter((x) => !addonHosts.some((h) => x.includes(h)) && !/permissions-policy|vite/i.test(x));
  note(`  console (${label}): ${p.length ? p.join(' | ') : 'clean'}`);
};
async function mouse(x, y) {
  await b.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, pointerType: 'mouse' });
}
async function key(k, code = k, keyCode = 9) {
  await b.send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, windowsVirtualKeyCode: keyCode, ...(k === 'Enter' ? { text: String.fromCharCode(13) } : {}) });
  await b.send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: keyCode });
}
const focusInfo = () => b.evaluate(() => {
  const a = document.activeElement;
  const cs = getComputedStyle(a);
  const ring = a.matches(':focus-visible') && (cs.outlineStyle !== 'none' || cs.boxShadow !== 'none' || !!a.closest('[data-flow]'));
  return `${a.tagName.toLowerCase()}${a.className && typeof a.className === 'string' ? '.' + a.className.split(' ')[0] : ''} "${(a.getAttribute('aria-label') ?? a.textContent ?? '').trim().slice(0, 40)}" focus-visible=${a.matches(':focus-visible')} ring=${ring}`;
});
async function tabTo(pred, max = 40) {
  for (let i = 0; i < max; i++) {
    await key('Tab');
    await sleep(60);
    if (await b.evaluate(pred)) return true;
  }
  return false;
}

for (const w of [1280, 390]) {
  note(`\n== width ${w} ==`);
  // home
  await b.goto(`${BASE}/?reduced=0`, w);
  await sleep(1400);
  await shot(`home-${w}.png`);
  problems(`home ${w}`);

  // status panel open
  await b.evaluate(() => document.querySelector('[data-status-btn]').click());
  await sleep(300);
  await shot(`status-panel-${w}.png`);
  note('  status panel: ' + (await b.evaluate(() => {
    const p = document.querySelector('[data-status-panel]');
    return `open=${!p.hidden} text="${p.innerText.replace(/\s+/g, ' ').trim()}"`;
  })));
  await key('Escape', 'Escape', 27);
  await sleep(150);
  note('  after Esc: ' + (await b.evaluate(() => `panel hidden=${document.querySelector('[data-status-panel]').hidden}, focus on pill=${document.activeElement?.matches('[data-status-btn]')}`)));

  // pipeline hover (AWS node)
  const pos = await b.evaluate(() => {
    const n = [...document.querySelectorAll('[data-node="aws"]')].find((e) => e.getBoundingClientRect().width > 0);
    n.scrollIntoView({ block: 'center', behavior: 'instant' });
    const r = n.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  await sleep(400);
  await mouse(pos.x - 5, pos.y - 5);
  await mouse(pos.x, pos.y);
  await sleep(700);
  await shot(`pipeline-hover-${w}.png`);
  note('  pipeline lit: ' + (await b.evaluate(() => [...document.querySelectorAll('.lit')].filter((e) => e.getBoundingClientRect().width > 0).map((e) => e.dataset.edge ?? e.dataset.node).join(','))));
  note('  pipeline links: ' + (await b.evaluate(() => [...document.querySelectorAll('[data-flow] [data-node]')].filter((e) => e.getBoundingClientRect().width > 0).map((e) => `${e.dataset.node}->${e.getAttribute('href')}`).join(' '))));

  // numbers: screen-reader copy
  note('  impact numbers (sr text): ' + (await b.evaluate(() => [...document.querySelectorAll('.stat .n .visually-hidden')].map((e) => e.textContent).join(' | '))));

  // footer
  await b.evaluate(() => document.querySelector('.site-footer').scrollIntoView({ block: 'end', behavior: 'instant' }));
  await sleep(500);
  await shot(`footer-${w}.png`);
  note('  footer meta: ' + (await b.evaluate(() => document.querySelector('.site-footer .meta').innerText.replace(/\s+/g, ' '))));

  // keyboard focus on the new controls
  await b.goto(`${BASE}/?reduced=0`, w);
  const okPill = await tabTo(() => document.activeElement?.matches('[data-status-btn]'));
  note(`  Tab to status pill: ${okPill} -> ${await focusInfo()}`);
  if (okPill) { await shot(`focus-status-${w}.png`); await key('Enter', 'Enter', 13); await sleep(200);
    note('  Enter opens panel: ' + (await b.evaluate(() => !document.querySelector('[data-status-panel]').hidden))); await key('Escape', 'Escape', 27); }
  const okSearch = await tabTo(() => document.activeElement?.matches('[data-palette-open]'));
  note(`  Tab to Search: ${okSearch} -> ${await focusInfo()}`);
  const okNode = await tabTo(() => document.activeElement?.matches('[data-node]'), 60);
  note(`  Tab to pipeline node: ${okNode} -> ${await focusInfo()}`);
  if (okNode) { await sleep(300); await shot(`focus-pipeline-${w}.png`); }
  if (w === 1280) {
    await b.goto(`${BASE}/?reduced=0`, w);
    const okRec = await tabTo(() => document.activeElement?.matches('.nav .rec'));
    note(`  Tab to For recruiters pill: ${okRec} -> ${await focusInfo()}`);
    if (okRec) await shot(`focus-recruiter-pill-${w}.png`);
  }
  // Ctrl+K still opens the palette, with /recruiter in it
  await b.goto(`${BASE}/?reduced=0`, w);
  await b.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'k', code: 'KeyK', windowsVirtualKeyCode: 75, modifiers: 2 });
  await b.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'k', code: 'KeyK', windowsVirtualKeyCode: 75, modifiers: 2 });
  await sleep(200);
  note('  Ctrl+K: ' + (await b.evaluate(() => `palette open=${document.querySelector('[data-palette]').open}, has /recruiter=${!!document.querySelector('[data-palette] [data-href="/recruiter"]')}, search label="${document.querySelector('.kbd-label')?.textContent}"`)));

  if (w === 390) {
    await b.goto(`${BASE}/?reduced=0`, w);
    await b.evaluate(() => document.querySelector('[data-menu-btn]').click());
    await sleep(250);
    await shot('menu-open-390.png');
    note('  mobile menu has For recruiters: ' + (await b.evaluate(() => !!document.querySelector('[data-nav][data-open] a[href="/recruiter"]'))));
  }

  // /recruiter
  await b.goto(`${BASE}/recruiter?reduced=0`, w);
  await sleep(600);
  await shot(`recruiter-${w}.png`, true);
  problems(`/recruiter ${w}`);
}

// header fit at in-between widths (no horizontal overflow, nothing clipped)
note('\n== header fit ==');
for (const w of [1100, 960, 880, 860, 700]) {
  await b.goto(`${BASE}/recruiter?reduced=1`, w);
  note(`  ${w}: ` + (await b.evaluate(() => {
    const bar = document.querySelector('.site-header .bar');
    const kids = [...bar.children].map((c) => c.getBoundingClientRect());
    const overlap = kids.some((r, i) => i && r.left < kids[i - 1].right - 1 && r.width > 0 && kids[i - 1].width > 0);
    return `page overflow=${document.documentElement.scrollWidth > innerWidth}, bar overflow=${bar.scrollWidth > bar.clientWidth}, overlap=${overlap}`;
  })));
  if (w === 960) await shot('header-960.png');
}

// beam on a client-side navigation
note('\n== beam (1280) ==');
await b.goto(`${BASE}/?reduced=0`, 1280);
await b.evaluate(() => { document.querySelector('a[href="/work"]').click(); });
await sleep(450);
await shot('beam-1280.png');
note('  beam animations running: ' + (await b.evaluate(() => document.querySelector('[data-beam]').getAnimations().length)));
problems('nav to /work');

// print
note('\n== /recruiter print ==');
await b.goto(`${BASE}/recruiter?reduced=1`, 1280);
const pdf = await b.send('Page.printToPDF', { paperWidth: 8.27, paperHeight: 11.69, printBackground: false, preferCSSPageSize: true });
const buf = Buffer.from(pdf.data, 'base64');
writeFileSync(join(out, 'print-recruiter.pdf'), buf);
const pages = (buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
note(`  wrote print-recruiter.pdf: ${pages} page(s) (A4)`);
await b.send('Emulation.setEmulatedMedia', { media: 'print' });
await b.send('Emulation.setDeviceMetricsOverride', { width: 794, height: 1123, deviceScaleFactor: 1, mobile: false });
await sleep(300);
await shot('print-recruiter-preview.png', true);
note('  print-media page height at 794px (A4 = 1123px incl. margins): ' + (await b.evaluate(() => document.documentElement.scrollHeight)));
await b.send('Emulation.setEmulatedMedia', { media: '' });

// reduced motion
note('\n== ?reduced=1 ==');
for (const w of [1280, 390]) {
  await b.goto(`${BASE}/?reduced=1`, w);
  const r = await b.evaluate(() => ({
    rm: document.documentElement.classList.contains('rm'),
    dotAnim: getComputedStyle(document.querySelector('.pill .dot')).animationName,
    beam: getComputedStyle(document.querySelector('[data-beam]')).display,
    numbers: [...document.querySelectorAll('[data-decode]')].every((e) => e.textContent === e.dataset.decode),
    packetsPaused: [...document.querySelectorAll('svg.flow')].every((s) => s.animationsPaused()),
    hot: getComputedStyle(document.getElementById('light')).getPropertyValue('--hot') || '(unset)',
  }));
  note(`  ${w}: rm=${r.rm} dot animation=${r.dotAnim} beam display=${r.beam} numbers final=${r.numbers} packets paused=${r.packetsPaused} hot=${r.hot}`);
  await shot(`home-reduced-${w}.png`);
  problems(`reduced home ${w}`);
}
await b.evaluate(() => { document.querySelector('a[href="/work"]').click(); });
await sleep(450);
note('  reduced nav: beam animations = ' + (await b.evaluate(() => document.querySelector('[data-beam]').getAnimations().length)));

writeFileSync(join(out, 'run.txt'), `M6 verification run, ${new Date().toISOString()}, ${BASE}, headless Edge (tools/m6-shots.mjs)\n` + log.join('\n') + '\n');
await b.close();

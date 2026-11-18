// CHK-2: full-page screenshots of the same pages in headless Edge (Chrome DevTools Protocol) and headless Firefox
// (WebDriver BiDi, built into Firefox), same viewport size in both, for a side-by-side comparison. No packages.
// Needs the built site served on BASE.   node tools/xbrowser.mjs [out-dir]
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { launch, BASE, killTree, killOnExit } from './cdp.mjs';

const FIREFOX = process.env.FIREFOX ?? 'C:/Program Files/Mozilla Firefox/firefox.exe';
const out = process.argv[2] ?? resolve(import.meta.dirname, '../../docs/screens/m4/xbrowser');
mkdirSync(out, { recursive: true });
const pages = { home: '/', work: '/work', case: '/work/gitops-secrets', experience: '/experience' };
const sizes = [[1280, 900], [390, 844]];
const q = '?reduced=1'; // static light + all reveals shown, so both browsers render the same frame
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const report = [];

// ---- Edge ----
const b = await launch(9335);
for (const [name, path] of Object.entries(pages)) {
  for (const [w, h] of sizes) {
    await b.goto(`${BASE}${path}${q}`, w, h);
    const full = await b.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.scrollHeight]);
    const { data } = await b.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: full[0], height: full[1], scale: 1 } });
    writeFileSync(join(out, `edge-${name}-${w}.png`), Buffer.from(data, 'base64'));
    report.push(`edge     ${path.padEnd(22)} ${w}x${h}  page ${full.join('x')}  console: ${b.problems.filter((p) => !p.includes('Permissions-Policy')).join(' | ') || 'clean'}`);
  }
}
await b.close();

// ---- Firefox (WebDriver BiDi) ----
const profile = mkdtempSync(join(tmpdir(), 'lp-ff-'));
const ff = spawn(FIREFOX, ['-headless', '-no-remote', '-profile', profile, '--remote-debugging-port', '9336'], { stdio: 'ignore' });
killOnExit(ff);
let ws;
for (let i = 0; i < 60 && !ws; i++) {
  await sleep(500);
  ws = await new Promise((res) => { const s = new WebSocket('ws://127.0.0.1:9336/session'); s.onopen = () => res(s); s.onerror = () => res(undefined); });
}
if (!ws) throw new Error('Firefox remote agent did not start');
let id = 0;
const waiting = new Map();
const logs = [];
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && waiting.has(msg.id)) { const { res, rej } = waiting.get(msg.id); waiting.delete(msg.id); msg.type === 'error' ? rej(new Error(msg.error + ': ' + msg.message)) : res(msg.result); }
  else if (msg.method === 'log.entryAdded' && ['error', 'warn'].includes(msg.params.level)) logs.push(`${msg.params.level}: ${msg.params.text}`);
};
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; waiting.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
await send('session.new', { capabilities: {} });
await send('session.subscribe', { events: ['log.entryAdded'] });
const { contexts } = await send('browsingContext.getTree', {});
const context = contexts[0].context;
for (const [name, path] of Object.entries(pages)) {
  for (const [w, h] of sizes) {
    logs.length = 0;
    await send('browsingContext.setViewport', { context, viewport: { width: w, height: h } });
    await send('browsingContext.navigate', { context, url: `${BASE}${path}${q}`, wait: 'complete' });
    await sleep(800);
    const size = (await send('script.evaluate', { target: { context }, expression: '[document.documentElement.scrollWidth, document.documentElement.scrollHeight].join("x")', awaitPromise: false })).result.value;
    const { data } = await send('browsingContext.captureScreenshot', { context, origin: 'document' });
    writeFileSync(join(out, `firefox-${name}-${w}.png`), Buffer.from(data, 'base64'));
    report.push(`firefox  ${path.padEnd(22)} ${w}x${h}  page ${size}  console: ${logs.join(' | ') || 'clean'}`);
  }
}
await send('session.end').catch(() => {});
ws.close();
await sleep(1000);
killTree(ff);
try { rmSync(profile, { recursive: true, force: true }); } catch { /* Firefox may still hold files */ }
console.log(report.join('\n'));

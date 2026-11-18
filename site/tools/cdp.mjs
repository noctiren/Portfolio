// Tiny Chrome DevTools Protocol helper for the audit scripts (no packages: Node's built-in WebSocket + fetch).
// Starts headless Edge with a throwaway profile, opens one tab, and gives back send()/eval()/goto()/close().
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, sep } from 'node:path';

export const EDGE = process.env.EDGE ?? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
export const BASE = process.env.BASE ?? 'http://127.0.0.1:4321';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Routes of the built site. Pages are built as files (M5: built.html is /built, index.html is /), plus 404. */
export function routes(dist) {
  const walk = (dir) =>
    readdirSync(dir).flatMap((f) => {
      const p = join(dir, f);
      if (statSync(p).isDirectory()) return f === '_astro' || f === 'og' ? [] : walk(p);
      if (!f.endsWith('.html') || p === join(dist, '404.html')) return [];
      const rel = relative(dist, p).split(sep).join('/').replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '');
      return ['/' + rel.replace(/\/$/, '')];
    });
  return [...walk(dist).sort(), '/404'];
}

/** Kill a browser we started, with all its child processes (Windows keeps renderer/GPU children alive otherwise). */
export function killTree(proc) {
  if (proc.exitCode !== null || proc.signalCode !== null) return;
  if (process.platform === 'win32') spawnSync('taskkill', ['/PID', String(proc.pid), '/T', '/F'], { stdio: 'ignore' });
  else proc.kill('SIGKILL');
}

/** Make sure a browser we started is gone when the script ends, also after a crash or Ctrl+C. */
export function killOnExit(proc) {
  const kill = () => killTree(proc);
  process.once('exit', kill);
  for (const sig of ['SIGINT', 'SIGTERM']) process.once(sig, () => { kill(); process.exit(130); });
  process.once('uncaughtException', (e) => { console.error(e); kill(); process.exit(1); });
  process.once('unhandledRejection', (e) => { console.error(e); kill(); process.exit(1); });
}

export async function launch(port = 9333) {
  const profile = mkdtempSync(join(tmpdir(), 'lp-cdp-'));
  // Off-screen as well as headless, so no window can show up in Alt-Tab or the taskbar.
  const proc = spawn(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
    '--window-position=-32000,-32000', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
  killOnExit(proc);
  let list;
  for (let i = 0; i < 50 && !list; i++) {
    await sleep(200);
    list = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json()).catch(() => undefined);
  }
  const page = list?.find((t) => t.type === 'page');
  if (!page) throw new Error('Edge did not start with remote debugging');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0;
  const waiting = new Map();
  const listeners = [];
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && waiting.has(msg.id)) {
      const { res, rej } = waiting.get(msg.id);
      waiting.delete(msg.id);
      msg.error ? rej(new Error(msg.error.message)) : res(msg.result);
    } else if (msg.method) listeners.forEach((f) => f(msg));
  };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; waiting.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  const problems = [];
  listeners.push((m) => {
    if (m.method === 'Runtime.exceptionThrown') problems.push('exception: ' + (m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text));
    if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) problems.push(`console.${m.params.type}: ` + m.params.args.map((a) => a.value ?? a.description).join(' '));
    if (m.method === 'Log.entryAdded' && ['error', 'warning'].includes(m.params.entry.level)) problems.push(`log.${m.params.entry.level}: ${m.params.entry.text} ${m.params.entry.url ?? ''}`.trim());
  });
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Log.enable');

  async function goto(url, width, height = 900, mobile = width < 600) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
    const loaded = new Promise((r) => listeners.push(function f(m) { if (m.method === 'Page.loadEventFired') { listeners.splice(listeners.indexOf(f), 1); r(); } }));
    problems.length = 0;
    await send('Page.navigate', { url });
    await loaded;
    await sleep(600);
  }
  async function evaluate(fn, arg) {
    const r = await send('Runtime.evaluate', { expression: `(${fn})(${JSON.stringify(arg ?? null)})`, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
    return r.result.value;
  }
  // Close the browser (that closes its pages too), then kill whatever is left of the process tree.
  // Each step has a time limit: a reply can never arrive once the page our socket talks to is gone.
  async function close() {
    const within = (p, ms) => Promise.race([p, sleep(ms)]).catch(() => {});
    await within(send('Browser.close'), 2000);
    ws.close();
    for (let i = 0; i < 20 && proc.exitCode === null; i++) await sleep(100);
    killTree(proc);
    try { rmSync(profile, { recursive: true, force: true }); } catch { /* Edge may still hold files */ }
  }
  return { send, goto, evaluate, close, problems };
}

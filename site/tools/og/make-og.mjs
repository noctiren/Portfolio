// Builds the link-preview cards (public/og/*.png, 1200x630) and the apple-touch icon (public/apple-touch-icon.png)
// by screenshotting tools/og/card.html in headless Edge. No packages needed.
// Titles come from the built pages, so run `npm run build` first:  node tools/og/make-og.mjs
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const EDGE = process.env.EDGE ?? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const root = resolve(import.meta.dirname, '../..');
const dist = join(root, 'dist');
const out = join(root, 'public/og');
const card = pathToFileURL(join(import.meta.dirname, 'card.html')).href;
mkdirSync(out, { recursive: true });

const decode = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();

function pages(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return f === '_astro' ? [] : pages(p);
    return f === 'index.html' ? [p] : [];
  });
}

function shot(url, file, w, h) {
  execFileSync(EDGE, [
    '--headless', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--force-device-scale-factor=1',
    `--window-size=${w},${h}`, '--virtual-time-budget=4000', `--screenshot=${file}`, url,
  ], { stdio: 'ignore' });
  if (!existsSync(file)) throw new Error(`no screenshot: ${file}`);
  console.log('wrote', relative(root, file));
}

for (const file of pages(dist)) {
  const route = '/' + relative(dist, file).split(sep).slice(0, -1).join('/');
  const html = readFileSync(file, 'utf8');
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '';
  const spans = [...h1.matchAll(/<span([^>]*)>([\s\S]*?)<\/span>/g)];
  const t = decode(spans.find((s) => !/outline/.test(s[1]))?.[2] ?? h1);
  const o = decode(spans.find((s) => /outline/.test(s[1]))?.[2] ?? '');
  const head = html.slice(html.indexOf('<main'));
  const k = decode(head.match(/class="label kicker"[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? '');
  const key = route === '/' ? 'home' : route.slice(1).replace(/\//g, '-');
  const q = new URLSearchParams({ mode: 'card', t, o, k, ...(route === '/' ? { home: '1' } : {}) });
  shot(`${card}?${q}`, join(out, `${key}.png`), 1200, 630);
}
// Edge's headless window has a minimum width (~500px), so the icon is rendered at 512 and browsers scale it.
shot(`${card}?mode=icon`, join(root, 'public/apple-touch-icon.png'), 512, 512);

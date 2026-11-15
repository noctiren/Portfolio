// Tiny static server for dist/ (no packages), used when `astro preview` is already taken. Behaves like a normal
// static host: gzip for text files, long cache for the hashed /_astro/ files, revalidate for pages.
//   node tools/serve.mjs [port]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve, normalize } from 'node:path';
import { gzipSync } from 'node:zlib';

const dist = resolve(import.meta.dirname, '../dist');
const port = Number(process.argv[2] ?? 4322);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };
const text = new Set(['.html', '.css', '.js', '.svg', '.xml', '.txt', '.json', '.webmanifest']);

function send(req, res, status, file, body) {
  const ext = extname(file);
  const headers = {
    'content-type': types[ext] ?? 'application/octet-stream',
    'cache-control': file.includes(`${join('dist', '_astro')}`) ? 'public, max-age=31536000, immutable' : 'public, max-age=0, must-revalidate',
  };
  if (text.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '')) {
    body = gzipSync(body);
    headers['content-encoding'] = 'gzip';
    headers.vary = 'Accept-Encoding';
  }
  res.writeHead(status, headers).end(body);
}

createServer(async (req, res) => {
  const p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^[/\\]+/, '');
  let file = join(dist, p);
  if (!file.startsWith(dist)) { res.writeHead(403).end(); return; }
  try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); } catch { file = join(dist, p, 'index.html'); }
  try {
    send(req, res, 200, file, await readFile(file));
  } catch {
    const nf = join(dist, '404.html');
    send(req, res, 404, nf, await readFile(nf).catch(() => Buffer.from('not found')));
  }
}).listen(port, '127.0.0.1', () => console.log(`serving dist on http://127.0.0.1:${port}`));

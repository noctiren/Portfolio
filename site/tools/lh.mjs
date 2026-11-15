// CHK-4: Lighthouse (mobile + desktop) on the key pages, headless Edge, built site served on BASE.
//   node tools/serve.mjs 4322   (gzip + cache headers like a real host), then   BASE=http://127.0.0.1:4322 node tools/lh.mjs <tag>
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { EDGE, BASE } from './cdp.mjs';

const tag = process.argv[2] ?? 'run';
// Hosts that browser add-ons on the dev PC inject; listed in the git-ignored .private/addon-hosts.txt (one per line).
const hostsFile = resolve(import.meta.dirname, '../../.private/addon-hosts.txt');
const addonHosts = existsSync(hostsFile) ? readFileSync(hostsFile, 'utf8').split(/\r?\n/).map((x) => x.trim()).filter(Boolean) : [];
const out = resolve(import.meta.dirname, '../../docs/screens/m4/lighthouse');
mkdirSync(out, { recursive: true });
const pages = { home: '/', work: '/work', case: '/work/gitops-secrets', experience: '/experience' };
const cli = resolve(import.meta.dirname, '../node_modules/lighthouse/cli/index.js');
const rows = [`Lighthouse ${tag}, ${new Date().toISOString().slice(0, 16).replace('T', ' ')}, headless Edge, ${BASE}${process.env.KEEP_INJECTED ? ', local browser add-ons injections INCLUDED' : ', local browser add-ons injections blocked'}`, 'page        preset    perf  a11y  best  seo   failing audits'];
for (const [name, path] of Object.entries(pages)) {
  for (const preset of ['mobile', 'desktop']) {
    const base = join(out, `${tag}-${name}-${preset}`);
    const args = [cli, `${BASE}${path}`, '--quiet', '--output=html', '--output=json', `--output-path=${base}`,
      '--chrome-flags=--headless=new --disable-gpu --no-first-run', '--only-categories=performance,accessibility,best-practices,seo'];
    if (preset === 'desktop') args.push('--preset=desktop');
    // local browser add-ons on this PC inject ~2 MB of scripts into every page; they are not part of the site.
    if (!process.env.KEEP_INJECTED) args.push(...addonHosts.map((h) => `--blocked-url-patterns=*${h}*`));
    try { execFileSync(process.execPath, args, { env: { ...process.env, CHROME_PATH: EDGE }, stdio: 'inherit' }); } catch (e) { rows.push(`${name} ${preset} FAILED ${e.message}`); continue; }
    const r = JSON.parse(readFileSync(`${base}.report.json`, 'utf8'));
    const s = (k) => String(Math.round(r.categories[k].score * 100)).padStart(4);
    const fails = Object.values(r.audits).filter((a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== 'informative' && a.scoreDisplayMode !== 'notApplicable' && a.scoreDisplayMode !== 'manual').map((a) => `${a.id}${a.displayValue ? ` (${a.displayValue})` : ''}`);
    rows.push(`${name.padEnd(11)} ${preset.padEnd(8)} ${s('performance')}  ${s('accessibility')}  ${s('best-practices')}  ${s('seo')}  ${fails.join('; ') || '-'}`);
  }
}
writeFileSync(join(out, `${tag}-summary.txt`), rows.join('\n') + '\n');
console.log(rows.join('\n'));

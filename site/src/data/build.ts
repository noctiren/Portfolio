// Real site facts, read once at build time (D-009): the git commit, the build time, and the page weight and
// Lighthouse scores measured in M4 (docs/screens/m4). Nothing here is typed in by hand: if a source is
// missing, the value is left out rather than guessed.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docs = resolve(process.cwd(), '../docs/screens/m4');

function git(...args: string[]): string | undefined {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || undefined;
  } catch {
    return undefined;
  }
}

function read(file: string): string {
  try {
    return readFileSync(resolve(docs, file), 'utf8');
  } catch {
    return '';
  }
}

/** YYYY-MM-DD and HH:MM in Cape Town time */
function capeTown(d: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Johannesburg', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
    })
      .formatToParts(d)
      .map((p) => [p.type, p.value]),
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
}

const commitIso = git('log', '-1', '--format=%cI');
const built = capeTown(new Date());

export const build = {
  hash: git('rev-parse', '--short', 'HEAD'),
  /** commit date (Cape Town), YYYY-MM-DD */
  commitDate: commitIso ? capeTown(new Date(commitIso)).date : undefined,
  /** when this copy of the site was built (Cape Town) */
  builtAt: `${built.date} ${built.time}`,
};

/* ---- page weight of the home page (tools/weight.mjs, gzipped HTML+CSS+JS, plus the woff2 fonts) ---- */
const weightTxt = read('weight.txt');
const homeRow = weightTxt.match(/^\/\s+([\d.]+)\/\s*([\d.]+)\s+([\d.]+)\/\s*([\d.]+)\s+([\d.]+)\/\s*([\d.]+)\s+([\d.]+)/m);
const weightDate = weightTxt.match(/(\d{4}-\d{2}-\d{2})/)?.[1];
export const weight = homeRow
  ? {
      codeGz: +(+homeRow[2] + +homeRow[4] + +homeRow[6]).toFixed(1),
      fonts: +homeRow[7],
      date: weightDate,
    }
  : undefined;

/* ---- Lighthouse, home page (tools/lh.mjs, final run) ---- */
const lhTxt = read('lighthouse/site-summary.txt');
const lhDate = lhTxt.match(/(\d{4}-\d{2}-\d{2})/)?.[1];
const lhRow = (preset: string) => {
  const m = lhTxt.match(new RegExp(`^home\\s+${preset}\\s+(\\d+)\\s+(\\d+)\\s+(\\d+)\\s+(\\d+)`, 'm'));
  return m ? { perf: +m[1], a11y: +m[2], best: +m[3], seo: +m[4] } : undefined;
};
const mobile = lhRow('mobile');
const desktop = lhRow('desktop');
export const lighthouse = mobile && desktop ? { mobile, desktop, date: lhDate } : undefined;

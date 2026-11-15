// Shell behaviour that must survive page changes: active nav link, mobile menu, scroll-progress line,
// header wordmark morph (home), scroll reveals, magnetic buttons and the diagram's packets.
import { reduced } from './motion';

const q = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel);

/* ---- active nav (the header is persisted, so it is not re-rendered per page) ---- */
function markActive() {
  const path = location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll<HTMLAnchorElement>('[data-nav] a').forEach((a) => {
    const href = a.getAttribute('href') ?? '';
    if (path === href || path.startsWith(href + '/')) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

/* ---- mobile menu ---- */
function setMenu(open: boolean, focusButton = false) {
  const btn = q<HTMLButtonElement>('[data-menu-btn]');
  const nav = q('[data-nav]');
  if (!btn || !nav) return;
  btn.setAttribute('aria-expanded', String(open));
  nav.toggleAttribute('data-open', open);
  if (focusButton) btn.focus();
  // The links come before the button in the page, so Tab would skip them: move focus into the open menu.
  if (open) nav.querySelector<HTMLAnchorElement>('a')?.focus();
}
document.addEventListener('click', (e) => {
  const t = e.target as Element;
  if (t.closest('[data-menu-btn]')) {
    setMenu(q('[data-menu-btn]')?.getAttribute('aria-expanded') !== 'true');
  } else if (!t.closest('[data-nav]')) {
    setMenu(false);
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && q('[data-nav][data-open]')) setMenu(false, true);
});
document.addEventListener('focusin', (e) => {
  // Tabbing out of the open menu closes it, so it doesn't stay over the page.
  const t = e.target as Element;
  if (q('[data-nav][data-open]') && !t.closest?.('[data-nav], [data-menu-btn]')) setMenu(false);
});

/* ---- live status pill: a disclosure panel (Esc or a click outside closes it, focus goes back to the pill) ---- */
function setStatus(open: boolean, focusButton = false) {
  const btn = q<HTMLButtonElement>('[data-status-btn]');
  const panel = q('[data-status-panel]');
  if (!btn || !panel) return;
  btn.setAttribute('aria-expanded', String(open));
  panel.hidden = !open;
  if (focusButton) btn.focus();
}
document.addEventListener('click', (e) => {
  const t = e.target as Element;
  if (t.closest('[data-status-btn]')) setStatus(q('[data-status-btn]')?.getAttribute('aria-expanded') !== 'true');
  else if (!t.closest('[data-status-panel]')) setStatus(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && q('[data-status-panel]:not([hidden])')) setStatus(false, true);
});
document.addEventListener('focusin', (e) => {
  // Tabbing out of the panel closes it.
  if (!(e.target as Element).closest?.('[data-status]')) setStatus(false);
});

/* ---- scroll-progress line ---- */
let progPending = false;
function progress() {
  progPending = false;
  const bar = q('[data-progress]');
  if (!bar) return;
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
}
addEventListener(
  'scroll',
  () => {
    if (!progPending) {
      progPending = true;
      requestAnimationFrame(progress);
    }
  },
  { passive: true },
);
addEventListener('resize', progress);

/* ---- header wordmark morph: home only, keyed off the hero name ---- */
let heroIO: IntersectionObserver | undefined;
function watchHeroName() {
  heroIO?.disconnect();
  const name = q('[data-hero-target]');
  const html = document.documentElement;
  if (!name) {
    delete html.dataset.heroName;
    return;
  }
  const headerH = q('[data-header]')?.getBoundingClientRect().height ?? 72;
  heroIO = new IntersectionObserver(
    ([e]) => {
      html.dataset.heroName = e.isIntersecting ? 'in-view' : 'out';
    },
    { rootMargin: `-${Math.round(headerH)}px 0px 0px 0px`, threshold: 0.15 },
  );
  heroIO.observe(name);
}

/* ---- scroll reveals ---- */
let revealIO: IntersectionObserver | undefined;
function reveals() {
  revealIO?.disconnect();
  const els = document.querySelectorAll('.rv, .wipe');
  if (reduced()) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12 },
  );
  els.forEach((el) => io.observe(el));
  revealIO = io;
}

/* ---- magnetic buttons (fine pointers, motion on) ---- */
function magnets() {
  if (reduced() || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll<HTMLElement>('.mag').forEach((b) => {
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    });
    b.addEventListener('pointerleave', () => {
      b.style.transform = '';
    });
  });
}

/* ---- case-study cards: tilt toward the pointer and move the inner light (fine pointers, motion on) ---- */
function tilt() {
  if (reduced() || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((c) => {
    c.addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      c.classList.add('tilting');
      c.style.setProperty('--ry', `${((px - 0.5) * 7).toFixed(2)}deg`);
      c.style.setProperty('--rx', `${((0.5 - py) * 6).toFixed(2)}deg`);
      c.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      c.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
    });
    c.addEventListener('pointerleave', () => {
      c.classList.remove('tilting');
      c.style.setProperty('--rx', '0deg');
      c.style.setProperty('--ry', '0deg');
    });
  });
}

/* ---- SMIL packets in the pipeline diagram: frozen under reduced motion ---- */
function svgMotion() {
  document.querySelectorAll<SVGSVGElement>('svg.flow').forEach((s) => {
    if (reduced()) {
      s.pauseAnimations();
      s.setCurrentTime(0);
    } else s.unpauseAnimations();
  });
}

/* ---- pipeline: hover or focus a node to light its path (git push -> that node) ---- */
function lightPath(node: Element | null) {
  document.querySelectorAll('[data-flow]').forEach((svg) => {
    svg.classList.toggle('lighting', !!node && svg.contains(node));
    svg.querySelectorAll('.lit').forEach((el) => el.classList.remove('lit'));
  });
  if (!node) return;
  const svg = node.closest('[data-flow]')!;
  const n = node as HTMLElement;
  (n.dataset.pathEdges ?? '').split(' ').filter(Boolean).forEach((id) => svg.querySelector(`[data-edge="${id}"]`)?.classList.add('lit'));
  (n.dataset.pathNodes ?? '').split(' ').filter(Boolean).forEach((id) => svg.querySelector(`[data-node="${id}"]`)?.classList.add('lit'));
}
document.addEventListener('pointerover', (e) => {
  const node = (e.target as Element).closest?.('[data-flow] [data-node]');
  if (node || (e.target as Element).closest?.('[data-flow]')) lightPath(node ?? null);
});
document.addEventListener('pointerout', (e) => {
  const to = e.relatedTarget as Element | null;
  if ((e.target as Element).closest?.('[data-flow]') && !to?.closest?.('[data-flow] [data-node]')) {
    lightPath(document.activeElement?.closest('[data-flow] [data-node]') ?? null);
  }
});
document.addEventListener('focusin', (e) => {
  lightPath((e.target as Element).closest?.('[data-flow] [data-node]') ?? null);
});

/* ---- impact numbers decode in: the visible copy scrambles (aria-hidden), screen readers get the final text ---- */
let decodeIO: IntersectionObserver | undefined;
const GLYPHS_D = '0123456789';
const GLYPHS_A = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
function scramble(el: HTMLElement) {
  const final = el.dataset.decode ?? el.textContent ?? '';
  const t0 = performance.now();
  const dur = 900;
  const step = (t: number) => {
    const p = Math.min(1, (t - t0) / dur);
    const locked = Math.floor(p * final.length);
    el.textContent = [...final]
      .map((ch, i) => {
        if (i < locked) return ch;
        if (/\d/.test(ch)) return GLYPHS_D[(Math.random() * 10) | 0];
        if (/[A-Za-z]/.test(ch)) {
          const g = GLYPHS_A[(Math.random() * GLYPHS_A.length) | 0];
          return ch === ch.toLowerCase() ? g.toLowerCase() : g;
        }
        return ch;
      })
      .join('');
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = final;
  };
  requestAnimationFrame(step);
}
function decoders() {
  decodeIO?.disconnect();
  const els = document.querySelectorAll<HTMLElement>('[data-decode]');
  els.forEach((el) => (el.textContent = el.dataset.decode ?? el.textContent));
  if (reduced()) return;
  decodeIO = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          scramble(e.target as HTMLElement);
          decodeIO?.unobserve(e.target);
        }
      }),
    { threshold: 0.6 },
  );
  els.forEach((el) => decodeIO!.observe(el));
}

/* ---- light-sweep beam across the screen on page changes (not on the first load) ---- */
document.addEventListener('astro:after-swap', () => {
  const beam = q('[data-beam]');
  if (!beam || reduced() || !beam.animate) return;
  beam.animate(
    [
      { transform: 'translateX(-30vw) skewX(-14deg)', opacity: 0 },
      { opacity: 1, offset: 0.25 },
      { opacity: 1, offset: 0.7 },
      { transform: 'translateX(115vw) skewX(-14deg)', opacity: 0 },
    ],
    { duration: 950, easing: 'cubic-bezier(0.45, 0, 0.25, 1)' },
  );
});

/* ---- footer clock: Cape Town time, updated every 30 s (text only, no motion) ---- */
const ctFmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Johannesburg', hour: '2-digit', minute: '2-digit', hour12: false });
function clock() {
  const el = q('[data-ct-clock]');
  if (el) el.textContent = ctFmt.format(new Date());
}
// tick just after each minute boundary, so the clock is never a minute behind
setTimeout(() => {
  clock();
  setInterval(clock, 60_000);
}, 60_000 - (Date.now() % 60_000) + 50);

/* ---- print: show everything (closed "Full details" would otherwise be left out), then restore ---- */
let printOpened: HTMLDetailsElement[] = [];
addEventListener('beforeprint', () => {
  printOpened = [...document.querySelectorAll<HTMLDetailsElement>('details:not([open])')];
  printOpened.forEach((d) => (d.open = true));
});
addEventListener('afterprint', () => {
  printOpened.forEach((d) => (d.open = false));
  printOpened = [];
});

document.addEventListener('astro:page-load', () => {
  markActive();
  setMenu(false);
  setStatus(false);
  progress();
  watchHeroName();
  reveals();
  magnets();
  tilt();
  svgMotion();
  lightPath(null);
  decoders();
  clock();
});

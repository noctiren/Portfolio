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

document.addEventListener('astro:page-load', () => {
  markActive();
  setMenu(false);
  progress();
  watchHeroName();
  reveals();
  magnets();
  tilt();
  svgMotion();
});

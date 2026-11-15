// The spotlight. Runs once per visit (bundled module); the #light layer is persisted across page changes,
// and the shadow casters (.cast) are re-collected after every navigation.
// Mouse: the light follows the cursor (eased). Touch: it drifts, jumps to taps and rides along with scrolling.
// Reduced motion: the light stays still; shadows are still computed (static, no animation).
// M6: on fine pointers the light is pulled toward (and brightens over) the hovered or focused button/card, and
// its tint follows the time of day in Cape Town (a static colour, so it also applies with motion off).
import { reduced } from './motion';

const touch = matchMedia('(hover: none)').matches;
let casters: HTMLElement[] = [];
let lx = innerWidth * 0.72;
let ly = innerHeight * 0.28;
let tx = lx;
let ty = ly;
let manual = false;
let manualAt = 0;
let dirty = true;
let running = false;
let lastScroll = scrollY;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const PULL = '.btn, .tile, .card, .row, [data-flow] [data-node], .pill, .kbd, .nav .rec';
let pulled: Element | null = null;

/* ---- Cape Town ambience: deep, dim blue at night, the normal --glow at mid-afternoon ---- */
const ctHour = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Johannesburg', hour: 'numeric', minute: 'numeric', hour12: false });
function ambience() {
  const layer = document.getElementById('light');
  if (!layer) return;
  const [h, m] = ctHour.format(new Date()).split(':').map(Number);
  const hour = (h % 24) + m / 60;
  const day = (1 - Math.cos((2 * Math.PI * (hour - 2)) / 24)) / 2; // 0 at 02:00, 1 at 14:00
  const c = (night: number, noon: number) => (night + (noon - night) * day).toFixed(3);
  layer.style.setProperty('--glow-c', `rgba(${c(40, 76)}, ${c(92, 155)}, ${c(220, 255)}, ${c(0.1, 0.16)})`);
  layer.style.setProperty('--lit-o', c(0.32, 0.45));
}
ambience();
setInterval(ambience, 5 * 60_000);

/** Pull the light toward an element's centre (60/40 with the pointer) and switch on the hot spot. */
function pullTo(el: Element | null, px?: number, py?: number) {
  pulled = el;
  document.getElementById('light')?.style.setProperty('--hot', el ? '1' : '0');
  if (!el) return;
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  manual = true;
  tx = px === undefined ? cx : cx * 0.6 + px * 0.4;
  ty = py === undefined ? cy : cy * 0.6 + py * 0.4;
}

function shade() {
  const layer = document.getElementById('light');
  if (layer) {
    layer.style.setProperty('--lx', `${lx.toFixed(1)}px`);
    layer.style.setProperty('--ly', `${ly.toFixed(1)}px`);
  }
  // Each caster's shadow points away from the light and shortens as the light gets close.
  // All rects are read first, then all styles written, so the loop never forces a style recalc per element.
  const rects = casters.map((el) => el.getBoundingClientRect());
  casters.forEach((el, i) => {
    const r = rects[i];
    if (r.bottom < -200 || r.top > innerHeight + 200) return;
    const dx = r.left + r.width / 2 - lx;
    const dy = r.top + r.height / 2 - ly;
    const d = Math.hypot(dx, dy) || 1;
    const k = Math.min(1, d / 700);
    el.style.setProperty('--dx', ((dx / d) * k).toFixed(3));
    el.style.setProperty('--dy', ((dy / d) * k).toFixed(3));
  });
}

function tick(t: number) {
  if (reduced()) {
    running = false;
    shade();
    return;
  }
  if (manual && touch && t - manualAt > 6000) manual = false;
  if (!manual) {
    tx = innerWidth * (0.5 + 0.36 * Math.sin(t / 4200));
    ty = innerHeight * (0.42 + 0.28 * Math.sin(t / 2900));
  }
  const nx = lx + (tx - lx) * 0.08;
  const ny = ly + (ty - ly) * 0.08;
  if (dirty || Math.abs(nx - lx) > 0.3 || Math.abs(ny - ly) > 0.3) {
    lx = nx;
    ly = ny;
    shade();
    dirty = false;
  }
  requestAnimationFrame(tick);
}

function start() {
  if (running || reduced()) return;
  running = true;
  requestAnimationFrame(tick);
}

addEventListener(
  'pointermove',
  (e) => {
    if (e.pointerType !== 'mouse') return;
    manual = true;
    const target = fine && !reduced() ? (e.target as Element).closest?.(PULL) : null;
    if (target) pullTo(target, e.clientX, e.clientY);
    else {
      if (pulled) pullTo(null);
      tx = e.clientX;
      ty = e.clientY;
    }
  },
  { passive: true },
);

addEventListener(
  'pointerdown',
  (e) => {
    if (e.pointerType === 'mouse') return;
    manual = true;
    manualAt = performance.now();
    tx = e.clientX;
    ty = e.clientY;
  },
  { passive: true },
);

addEventListener(
  'scroll',
  () => {
    dirty = true;
    const d = scrollY - lastScroll;
    lastScroll = scrollY;
    if (touch && !reduced()) {
      // Ride along with the page so the light feels pinned to what was tapped; drift resumes off-screen.
      // (While drifting, tick() sets the target every frame, so scrolling has nothing to adjust.)
      if (manual) {
        ty -= d;
        manualAt = performance.now();
        if (ty < -100 || ty > innerHeight + 100) manual = false;
      }
    }
    if (reduced()) shade();
  },
  { passive: true },
);

// Keyboard focus pulls the light too (pointer devices only: on touch the light follows taps instead).
document.addEventListener('focusin', (e) => {
  if (!fine || reduced()) return;
  const t = (e.target as Element).closest?.(PULL);
  if (t && (e.target as Element).matches(':focus-visible')) pullTo(t);
  else if (pulled) pullTo(null);
});

addEventListener('resize', () => {
  dirty = true;
  if (reduced()) shade();
});

document.addEventListener('astro:page-load', () => {
  casters = [...document.querySelectorAll<HTMLElement>('.cast')];
  pullTo(null);
  ambience();
  lastScroll = scrollY;
  if (reduced()) {
    lx = innerWidth * 0.72;
    ly = innerHeight * 0.28;
  }
  dirty = true;
  shade();
  start();
});

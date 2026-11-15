// The spotlight. Runs once per visit (bundled module); the #light layer is persisted across page changes,
// and the shadow casters (.cast) are re-collected after every navigation.
// Mouse: the light follows the cursor (eased). Touch: it drifts, jumps to taps and rides along with scrolling.
// Reduced motion: the light stays still; shadows are still computed (static, no animation).
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

function shade() {
  const layer = document.getElementById('light');
  if (layer) {
    layer.style.setProperty('--lx', `${lx.toFixed(1)}px`);
    layer.style.setProperty('--ly', `${ly.toFixed(1)}px`);
  }
  // Each caster's shadow points away from the light and shortens as the light gets close.
  for (const el of casters) {
    const r = el.getBoundingClientRect();
    if (r.bottom < -200 || r.top > innerHeight + 200) continue;
    const dx = r.left + r.width / 2 - lx;
    const dy = r.top + r.height / 2 - ly;
    const d = Math.hypot(dx, dy) || 1;
    const k = Math.min(1, d / 700);
    el.style.setProperty('--dx', ((dx / d) * k).toFixed(3));
    el.style.setProperty('--dy', ((dy / d) * k).toFixed(3));
  }
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
    tx = e.clientX;
    ty = e.clientY;
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
      if (manual) {
        ty -= d;
        manualAt = performance.now();
        if (ty < -100 || ty > innerHeight + 100) manual = false;
      } else {
        ty = Math.min(innerHeight * 0.9, Math.max(innerHeight * 0.1, ty - d * 0.5));
      }
    }
    if (reduced()) shade();
  },
  { passive: true },
);

addEventListener('resize', () => {
  dirty = true;
  if (reduced()) shade();
});

document.addEventListener('astro:page-load', () => {
  casters = [...document.querySelectorAll<HTMLElement>('.cast')];
  lastScroll = scrollY;
  if (reduced()) {
    lx = innerWidth * 0.72;
    ly = innerHeight * 0.28;
  }
  dirty = true;
  shade();
  start();
});

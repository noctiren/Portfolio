// Ctrl/Cmd+K command palette. The <dialog> is re-rendered on every page, so everything is delegated
// from document and looked up fresh each time.
import { navigate } from 'astro:transitions/client';

const dlg = () => document.querySelector<HTMLDialogElement>('[data-palette]');
const input = () => document.querySelector<HTMLInputElement>('[data-palette-input]');
const options = () => [...document.querySelectorAll<HTMLLIElement>('[data-palette-list] [role="option"]')];
const visible = () => options().filter((o) => !o.hidden);
let active = 0;
let opener: HTMLElement | null = null;

function select(i: number) {
  const vis = visible();
  options().forEach((o) => o.setAttribute('aria-selected', 'false'));
  if (!vis.length) {
    input()?.removeAttribute('aria-activedescendant');
    return;
  }
  active = (i + vis.length) % vis.length;
  const cur = vis[active];
  cur.setAttribute('aria-selected', 'true');
  input()?.setAttribute('aria-activedescendant', cur.id);
  cur.scrollIntoView({ block: 'nearest' });
}

function filter() {
  const term = (input()?.value ?? '').trim().toLowerCase();
  options().forEach((o) => {
    o.hidden = !!term && !(o.dataset.label ?? '').includes(term);
  });
  const empty = document.querySelector<HTMLElement>('[data-palette-empty]');
  if (empty) empty.hidden = visible().length > 0;
  select(0);
}

function open() {
  const d = dlg();
  if (!d || d.open) return;
  opener = document.activeElement as HTMLElement | null;
  d.showModal();
  const i = input();
  if (i) {
    i.value = '';
    filter();
    i.focus();
  }
}

function close() {
  const d = dlg();
  if (d?.open) d.close();
}

function go(li: HTMLElement | undefined) {
  const href = li?.dataset.href;
  if (!href) return;
  opener = null;
  close();
  if (/^https?:/.test(href)) location.href = href; // external link (GitHub)
  else if (href !== location.pathname) navigate(href);
}

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (dlg()?.open) close();
    else open();
    return;
  }
  if (!(e.target as Element).matches?.('[data-palette-input]')) return;
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    select(active + 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    select(active - 1);
  } else if (e.key === 'Home') {
    e.preventDefault();
    select(0);
  } else if (e.key === 'End') {
    e.preventDefault();
    select(visible().length - 1);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    go(visible()[active]);
  }
});

document.addEventListener('input', (e) => {
  if ((e.target as Element).matches?.('[data-palette-input]')) filter();
});

document.addEventListener('click', (e) => {
  const t = e.target as Element;
  if (t.closest('[data-palette-open]')) {
    open();
    return;
  }
  const li = t.closest<HTMLLIElement>('[data-palette] [role="option"]');
  if (li) {
    go(li);
    return;
  }
  if (t === dlg()) close(); // click on the backdrop
});

// Focus goes back to whatever opened the palette (unless we navigated away).
document.addEventListener(
  'close',
  (e) => {
    if ((e.target as Element).matches?.('[data-palette]') && opener?.isConnected) opener.focus();
  },
  true,
);

document.addEventListener('astro:page-load', () => {
  const label = document.querySelector('[data-kbd-label]');
  if (label && /Mac|iPhone|iPad/.test(navigator.platform)) label.textContent = '⌘ K';
});

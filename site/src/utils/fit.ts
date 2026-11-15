// Giant titles must fit their longest word on one line (no mid-word breaks, no hyphenation).
// fitEm() estimates the width, in em, of the longest word in the condensed display font. Per-letter
// widths were measured in Archivo 800 at 68% width (2026-11-15) and rounded up for safety.
// The CSS then caps the font size at (available width / fitEm): see .fit in global.css.
const wide: Record<string, number> = { W: 0.75, M: 0.72 };
const narrow: Record<string, number> = { I: 0.26, J: 0.45, '-': 0.33, '.': 0.25, ',': 0.25, "'": 0.2, '+': 0.5 };

export function fitEm(...lines: (string | undefined)[]): number {
  const words = lines.filter(Boolean).join(' ').toUpperCase().split(/\s+/).filter(Boolean);
  const w = (word: string) => [...word].reduce((s, ch) => s + (wide[ch] ?? narrow[ch] ?? 0.55), 0);
  return Math.max(1, ...words.map(w));
}

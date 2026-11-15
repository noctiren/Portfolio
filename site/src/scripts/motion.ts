/** True when motion is off: prefers-reduced-motion, or the ?reduced=1 override (see Base.astro). */
export const reduced = (): boolean => document.documentElement.classList.contains('rm');

// Pages are built as files (built.html, D-003 / M5), so at build time Astro.url.pathname ends in ".html".
// This turns it back into the address people see: "/built.html" -> "/built", "/index.html" -> "/".
export const cleanPath = (pathname: string): string =>
  pathname.replace(/(^|\/)index\.html$/, '/').replace(/\.html$/, '').replace(/\/$/, '') || '/';

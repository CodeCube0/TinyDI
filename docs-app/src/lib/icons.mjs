// Small hand-drawn line icon set (stroke-based, currentColor). No icon
// library dependency — consistent with the site's zero-dependency ethic.

function svg(paths, viewBox = '0 0 24 24') {
  return `<svg viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

export const icons = {
  logo: svg(
    '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><path d="M7 10.5v3a3 3 0 0 0 3 3h4"/><path d="M14.5 16.5v-3a3 3 0 0 0-3-3"/>',
  ),
  menu: svg('<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>'),
  close: svg('<path d="M6 6l12 12"/><path d="M18 6L6 18"/>'),
  search: svg('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8"/>'),
  sun: svg(
    '<circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.5"/><path d="M12 19v2.5"/><path d="M4.2 4.2l1.8 1.8"/><path d="M18 18l1.8 1.8"/><path d="M2.5 12H5"/><path d="M19 12h2.5"/><path d="M4.2 19.8L6 18"/><path d="M18 6l1.8-1.8"/>',
  ),
  moon: svg('<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>'),
  chevronDown: svg('<path d="M6 9l6 6 6-6"/>'),
  arrowRight: svg('<path d="M4 12h16"/><path d="M13 5l7 7-7 7"/>'),
  externalLink: svg(
    '<path d="M9 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"/><path d="M14 4h6v6"/><path d="M10 14L20 4"/>',
  ),
  tip: svg(
    '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.45 1 1.2 1 2.1h5c0-.9.4-1.65 1-2.1A6 6 0 0 0 12 3z"/>',
  ),
  warning: svg(
    '<path d="M10.3 3.9l-8 14A1.8 1.8 0 0 0 3.9 20.5h16.2a1.8 1.8 0 0 0 1.6-2.6l-8-14a1.8 1.8 0 0 0-3.4 0z"/><path d="M12 9.5v4"/><path d="M12 17h.01"/>',
  ),
  copy: svg(
    '<rect x="9" y="9" width="11" height="11" rx="1.5"/><path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"/>',
  ),
  check: svg('<path d="M4.5 12.5l5 5 10-11"/>'),
  singleton: svg('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.5"/>'),
  transient: svg(
    '<path d="M4 12a8 8 0 0 1 13.66-5.66L20 8"/><path d="M20 4v4h-4"/><path d="M20 12a8 8 0 0 1-13.66 5.66L4 16"/><path d="M4 20v-4h4"/>',
  ),
  shieldCheck: svg(
    '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/><path d="M9 12l2 2 4-4.5"/>',
  ),
  puzzle: svg(
    '<path d="M9 4.5h3.5a1.5 1.5 0 0 1 0 3H12a1.75 1.75 0 0 0 0 3.5h4.5V15a1.5 1.5 0 0 1-3 0v-.25a1.75 1.75 0 0 0-3.5 0V19H4.5v-4.5H8a1.5 1.5 0 0 0 0-3h-.25a1.75 1.75 0 0 1 0-3.5H9v-3.5z"/>',
  ),
  feather: svg(
    '<path d="M20 3S9 4 6 9c-3.2 5.3.5 10 4 10 4.5 0 6-4 6-4"/><path d="M20 3s-1 6-4 9-9 3.5-9.5 3-.5-6.5 2.5-9.5S20 3 20 3z"/><path d="M11 13L4 20"/>',
  ),
  github: svg(
    '<path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .26.18.58.69.48A10 10 0 0 0 12 2z"/>',
  ),
  container: svg(
    '<rect x="3.5" y="4" width="17" height="16" rx="2"/><path d="M3.5 9.5h17"/><circle cx="7" cy="6.75" r=".6" fill="currentColor" stroke="none"/><circle cx="9.2" cy="6.75" r=".6" fill="currentColor" stroke="none"/>',
  ),
  token: svg(
    '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 3v18"/><path d="M4 7.5l8 4.5 8-4.5"/>',
  ),
  factory: svg(
    '<path d="M3.5 20.5v-8l4.5 3v-3l4.5 3v-3l4.5 3v5z"/><path d="M3.5 20.5h17"/><path d="M17 9V5.5h2V9"/>',
  ),
};

export function icon(name, className = '') {
  const markup = icons[name];
  if (!markup) throw new Error(`Unknown icon "${name}"`);
  return className ? markup.replace('<svg ', `<svg class="${className}" `) : markup;
}

import { docsNav, strings, docsHref, homeHref, otherLang, SITE_URL, BASE_PATH } from '../nav.mjs';
import { icon } from '../lib/icons.mjs';

function themeInitScript() {
  // Inline + synchronous: must run before first paint to avoid a flash of
  // the wrong theme. Dark is the default when nothing is stored yet.
  return `(function(){try{var t=localStorage.getItem('tinydi-theme');document.documentElement.dataset.theme=(t==='light'||t==='dark')?t:'dark';}catch(e){document.documentElement.dataset.theme='dark';}})();`;
}

function platformInitScript() {
  // Inline + synchronous, same reasoning as themeInitScript: sets
  // data-platform on <html> before first paint so the search shortcut hint
  // (Cmd K vs Ctrl K) never flashes the wrong keycap. Defaults to "other"
  // when detection fails, matching the majority of visitors.
  return `(function(){try{document.documentElement.dataset.platform=/mac/i.test(navigator.platform)?'mac':'other';}catch(e){document.documentElement.dataset.platform='other';}})();`;
}

function langBannerInitScript(bannerLang) {
  // Inline + synchronous, same reasoning as themeInitScript: decides
  // *before first paint* whether the "also available in ..." banner should
  // be visible, by setting data-lang-banner-show on <html> (see the
  // [data-lang-banner-show] CSS rule in components.css). Previously this
  // decision was made by lang.js, a deferred script that only runs after
  // the page has already painted — so readers with a stored language
  // preference saw the banner pop in and push the whole page down a beat
  // after landing on every page. Kept in sync with lang.js's dismiss logic.
  return `(function(){try{var pref=localStorage.getItem('tinydi-lang');var dismissed=sessionStorage.getItem('tinydi-lang-banner-dismissed')==='${bannerLang}';if(pref==='${bannerLang}'&&!dismissed){document.documentElement.dataset.langBannerShow='true';}}catch(e){}})();`;
}

function head({ lang, pageId, title, description, section }) {
  const s = strings[lang];
  const path = section === 'home' ? homeHref(lang) : docsHref(lang, pageId);
  const enPath = section === 'home' ? homeHref('en') : docsHref('en', pageId);
  const itPath = section === 'home' ? homeHref('it') : docsHref('it', pageId);
  const fullTitle =
    section === 'home' ? `${s.siteName} — ${s.tagline}` : `${title} — ${s.siteName}`;

  return `
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${fullTitle}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${SITE_URL}${path}" />
  <link rel="alternate" hreflang="en" href="${SITE_URL}${enPath}" />
  <link rel="alternate" hreflang="it" href="${SITE_URL}${itPath}" />
  <link rel="alternate" hreflang="x-default" href="${SITE_URL}${enPath}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${s.siteName}" />
  <meta property="og:title" content="${fullTitle}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:locale" content="${lang === 'en' ? 'en_US' : 'it_IT'}" />
  <meta name="twitter:card" content="summary" />
  <link rel="icon" type="image/svg+xml" href="${BASE_PATH}/assets/favicon.svg" />
  <link rel="stylesheet" href="${BASE_PATH}/styles/fonts.css" />
  <link rel="stylesheet" href="${BASE_PATH}/styles/tokens.css" />
  <link rel="stylesheet" href="${BASE_PATH}/styles/base.css" />
  <link rel="stylesheet" href="${BASE_PATH}/styles/components.css" />
  <script>${themeInitScript()}</script>
  <script>${platformInitScript()}</script>
  <script>${langBannerInitScript(otherLang(lang))}</script>`;
}

function langSwitchMarkup(lang, pageId, section) {
  const targetId = section === 'home' ? null : pageId;
  const enHref = section === 'home' ? homeHref('en') : docsHref('en', targetId);
  const itHref = section === 'home' ? homeHref('it') : docsHref('it', targetId);
  return `
    <div class="lang-switch" role="group" aria-label="Language">
      <a href="${enHref}" data-lang-link="en" ${lang === 'en' ? 'aria-current="true"' : ''}>EN</a>
      <a href="${itHref}" data-lang-link="it" ${lang === 'it' ? 'aria-current="true"' : ''}>IT</a>
    </div>`;
}

function headerMarkup({ lang, pageId, section }) {
  const s = strings[lang];
  const isDocsActive = section === 'docs' && pageId !== 'examples';
  return `
  <header class="site-header">
    <div class="container site-header__inner">
      <a class="site-header__logo" href="${homeHref(lang)}">
        ${icon('logo')}
        <span>${s.siteName}</span>
      </a>
      <nav class="site-header__nav" aria-label="Primary">
        <a href="${docsHref(lang, 'installation')}" ${isDocsActive ? 'aria-current="page"' : ''}>${s.navDocs}</a>
        <a href="${docsHref(lang, 'examples')}" ${pageId === 'examples' ? 'aria-current="page"' : ''}>${s.navExamples}</a>
        <a href="https://github.com/CodeCube0/TinyDI" target="_blank" rel="noopener">${s.navGithub} ${icon('externalLink')}</a>
      </nav>
      <div class="site-header__actions">
        <button type="button" class="icon-btn search-trigger" data-search-trigger aria-haspopup="dialog">
          ${icon('search')}<span class="label">${s.searchLabel}</span><span class="shortcut-kbd shortcut-kbd--mac"><kbd>&#8984;</kbd><kbd>K</kbd></span><span class="shortcut-kbd shortcut-kbd--other"><kbd>Ctrl</kbd><kbd>K</kbd></span>
        </button>
        <button type="button" class="icon-btn theme-toggle" data-theme-toggle aria-label="${s.themeToggle}">
          ${icon('sun', 'icon-sun')}${icon('moon', 'icon-moon')}
        </button>
        ${langSwitchMarkup(lang, pageId, section)}
        <button type="button" class="site-header__menu-toggle" data-drawer-open aria-label="${s.menuLabel}">
          ${icon('menu')}
        </button>
      </div>
    </div>
  </header>`;
}

function langBannerMarkup(lang) {
  const other = otherLang(lang);
  const s = strings[other];
  return `
  <div class="container" data-lang-banner="${other}" style="margin-top: var(--space-4);">
    <div class="callout callout--tip" style="align-items:center;">
      ${icon('tip', 'callout__icon')}
      <div class="callout__body" style="display:flex;align-items:center;gap:var(--space-4);flex-wrap:wrap;">
        <p style="margin:0;">${s.langBannerText}</p>
        <a class="btn btn--ghost" data-lang-link="${other}" href="${homeHref(other)}" style="padding:0.4rem 0.9rem;">${s.langBannerCta}</a>
        <button type="button" class="icon-btn" data-lang-banner-dismiss aria-label="${s.langBannerDismiss}" style="margin-left:auto;">${icon('close')}</button>
      </div>
    </div>
  </div>`;
}

function drawerMarkup({ lang, pageId, section }) {
  const s = strings[lang];
  const sidebarLinks =
    section === 'docs'
      ? docsNav
          .map(
            (item) => `
        <a class="docs-sidebar__link" href="${docsHref(lang, item.id)}" ${item.id === pageId ? 'aria-current="page"' : ''}>${item[lang]}</a>`,
          )
          .join('')
      : '';

  return `
  <dialog class="docs-drawer" data-drawer aria-label="${s.docsMenuLabel}">
    <div class="docs-drawer__inner">
      <button type="button" class="icon-btn docs-drawer__close" data-drawer-close aria-label="Close">
        ${icon('close')}<span>${s.menuLabel}</span>
      </button>
      <nav aria-label="Primary" style="margin-bottom: var(--space-8);">
        <div class="docs-sidebar__group">
          <a class="docs-sidebar__link" href="${docsHref(lang, 'installation')}">${s.navDocs}</a>
          <a class="docs-sidebar__link" href="${docsHref(lang, 'examples')}">${s.navExamples}</a>
          <a class="docs-sidebar__link" href="https://github.com/CodeCube0/TinyDI" target="_blank" rel="noopener">${s.navGithub}</a>
        </div>
      </nav>
      ${
        section === 'docs'
          ? `<nav aria-label="${s.docsMenuLabel}"><div class="docs-sidebar__group"><p class="docs-sidebar__group-title">${s.navDocs}</p>${sidebarLinks}</div></nav>`
          : ''
      }
    </div>
  </dialog>`;
}

function sidebarMarkup(lang, pageId) {
  const links = docsNav
    .map(
      (item) => `
    <a class="docs-sidebar__link" href="${docsHref(lang, item.id)}" ${item.id === pageId ? 'aria-current="page"' : ''}>${item[lang]}</a>`,
    )
    .join('');
  return `
  <nav class="docs-sidebar" aria-label="${strings[lang].docsMenuLabel}">
    <div class="docs-sidebar__group">
      <p class="docs-sidebar__group-title">${strings[lang].navDocs}</p>
      ${links}
    </div>
  </nav>`;
}

function tocMarkup(lang, tocItems) {
  if (!tocItems || tocItems.length === 0) return '<div></div>';
  const links = tocItems
    .map((item) => `<a href="#${item.id}" data-toc-link>${item.text}</a>`)
    .join('');
  return `
  <aside class="docs-toc">
    <p class="docs-toc__title">${strings[lang].onThisPage}</p>
    ${links}
  </aside>`;
}

function searchDialogMarkup(lang) {
  const s = strings[lang];
  return `
  <dialog class="search-dialog" data-search-dialog data-index-url="${BASE_PATH}/search-index.${lang}.json" aria-label="${s.searchLabel}">
    <div class="search-dialog__inner">
      <div class="search-dialog__input-row">
        ${icon('search')}
        <input type="search" class="search-dialog__input" data-search-input placeholder="${s.searchPlaceholder}" aria-label="${s.searchLabel}" />
        <button type="button" class="icon-btn search-dialog__close" data-search-close aria-label="Close">${icon('close')}</button>
      </div>
      <ul class="search-dialog__results" data-search-results></ul>
      <p class="search-dialog__empty" data-search-empty hidden>${s.searchEmpty}</p>
      <div class="search-dialog__hint">
        <span><kbd>&uarr;</kbd><kbd>&darr;</kbd> ${s.searchHintNav}</span>
        <span><kbd>&crarr;</kbd> ${s.searchHintSelect}</span>
        <span><kbd>Esc</kbd> ${s.searchHintClose}</span>
      </div>
    </div>
  </dialog>`;
}

function footerMarkup(lang) {
  const s = strings[lang];
  return `
  <footer class="site-footer">
    <div class="container site-footer__inner">
      <p class="site-footer__note">© TinyDI. ${s.footerNote}</p>
      <nav class="site-footer__links" aria-label="Footer">
        <a href="${docsHref(lang, 'installation')}">${s.navDocs}</a>
        <a href="${docsHref(lang, 'examples')}">${s.navExamples}</a>
        <a href="https://github.com/CodeCube0/TinyDI" target="_blank" rel="noopener">${s.navGithub}</a>
      </nav>
    </div>
  </footer>`;
}

/**
 * Renders a full HTML page.
 * @param {{
 *   lang: 'en'|'it', pageId: string, title: string, description: string,
 *   section: 'home'|'docs', bodyHtml: string, tocItems?: {id:string,text:string}[]
 * }} options
 */
export function renderLayout(options) {
  const { lang, pageId, section, bodyHtml, tocItems } = options;
  const s = strings[lang];

  const main =
    section === 'docs'
      ? `
      <div class="container docs-layout">
        ${sidebarMarkup(lang, pageId)}
        <main id="content" class="docs-content">${bodyHtml}</main>
        ${tocMarkup(lang, tocItems)}
      </div>`
      : `<main id="content">${bodyHtml}</main>`;

  return `<!doctype html>
<html lang="${s.htmlLang}">
<head>
${head(options)}
</head>
<body>
  <a class="skip-link" href="#content">${s.skipToContent}</a>
  ${headerMarkup(options)}
  ${langBannerMarkup(lang)}
  ${main}
  ${footerMarkup(lang)}
  ${drawerMarkup(options)}
  ${searchDialogMarkup(lang)}
  <script src="${BASE_PATH}/scripts/theme.js" defer></script>
  <script src="${BASE_PATH}/scripts/nav.js" defer></script>
  <script src="${BASE_PATH}/scripts/code-block.js" defer></script>
  <script src="${BASE_PATH}/scripts/search.js" defer></script>
  <script src="${BASE_PATH}/scripts/lang.js" defer></script>
</body>
</html>`;
}

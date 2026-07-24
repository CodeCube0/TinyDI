// Placeholder production origin, used only to build absolute hreflang/canonical
// URLs. TinyDI has not been assigned a real domain yet (that's Phase 4 scope,
// see reports/03-docs-website.md) — replace this once one exists. Overridable
// via DOCS_SITE_URL so CI can build for the real deploy target (e.g. GitHub
// Pages' https://codecube0.github.io) without touching this default, which
// stays correct for local dev.
export const SITE_URL = process.env.DOCS_SITE_URL ?? 'https://tinydi.dev';

// Prefix for every root-relative internal path (styles, scripts, assets,
// search index, and page links via docsHref/homeHref below). Empty for local
// dev and for a future custom domain (both serve the site from `/`); set to
// e.g. "/TinyDI" in CI when deploying to GitHub Pages' default project-page
// URL, which serves the site under a subpath instead of the domain root.
export const BASE_PATH = process.env.DOCS_BASE_PATH ?? '';

// Shared nav model — one source of truth for the sidebar, the search index
// page grouping, and the header's primary nav.
export const docsNav = [
  { id: 'installation', en: 'Installation', it: 'Installazione' },
  { id: 'quick-start', en: 'Quick Start', it: 'Quick Start' },
  { id: 'tokens', en: 'Tokens', it: 'Token' },
  { id: 'container', en: 'Container', it: 'Container' },
  { id: 'lifetimes', en: 'Lifetimes', it: 'Lifetime' },
  { id: 'api-reference', en: 'API Reference', it: 'API Reference' },
  { id: 'examples', en: 'Examples', it: 'Esempi' },
  { id: 'faq', en: 'FAQ', it: 'FAQ' },
  { id: 'comparison', en: 'Comparison', it: 'Confronto' },
];

export const strings = {
  en: {
    htmlLang: 'en',
    siteName: 'TinyDI',
    tagline: 'Modern Type-Safe Dependency Injection Without Reflection',
    navDocs: 'Docs',
    navExamples: 'Examples',
    navGithub: 'GitHub',
    searchLabel: 'Search',
    searchPlaceholder: 'Search docs, guides, examples…',
    searchEmpty: 'No results. Try a different term.',
    searchHintNav: 'to navigate',
    searchHintSelect: 'to select',
    searchHintClose: 'to close',
    themeToggle: 'Toggle theme',
    langBannerText: 'This page is also available in English.',
    langBannerCta: 'Continue in English',
    langBannerDismiss: 'Dismiss',
    menuLabel: 'Menu',
    docsMenuLabel: 'Documentation menu',
    onThisPage: 'On this page',
    editOnGithub: 'Edit on GitHub',
    footerNote: `MIT Licensed.`,
    skipToContent: 'Skip to content',
    homeHref: '/',
  },
  it: {
    htmlLang: 'it',
    siteName: 'TinyDI',
    tagline: 'Dependency Injection Moderna e Type-Safe, Senza Reflection',
    navDocs: 'Documentazione',
    navExamples: 'Esempi',
    navGithub: 'GitHub',
    searchLabel: 'Cerca',
    searchPlaceholder: 'Cerca nella documentazione, guide, esempi…',
    searchEmpty: 'Nessun risultato. Prova un altro termine.',
    searchHintNav: 'per navigare',
    searchHintSelect: 'per selezionare',
    searchHintClose: 'per chiudere',
    themeToggle: 'Cambia tema',
    langBannerText: 'This page is also available in Italiano.',
    langBannerCta: 'Continua in italiano',
    langBannerDismiss: 'Ignora',
    menuLabel: 'Menu',
    docsMenuLabel: 'Menu documentazione',
    onThisPage: 'In questa pagina',
    editOnGithub: 'Modifica su GitHub',
    footerNote: `Rilasciato con licenza MIT.`,
    skipToContent: 'Vai al contenuto',
    homeHref: '/it/',
  },
};

export function docsHref(lang, id) {
  return lang === 'en' ? `${BASE_PATH}/docs/${id}.html` : `${BASE_PATH}/it/docs/${id}.html`;
}

export function homeHref(lang) {
  return lang === 'en' ? `${BASE_PATH}/` : `${BASE_PATH}/it/`;
}

export function otherLang(lang) {
  return lang === 'en' ? 'it' : 'en';
}
